# -*- coding: utf-8 -*-
"""Crawl đầy đủ sản phẩm từ quangloi.com.vn (có phân trang) -> data/products.js + img/products/*
Chạy: python tools/scrape_quangloi.py
"""
import re, json, os, sys, html, hashlib, urllib.request, urllib.parse
from concurrent.futures import ThreadPoolExecutor

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, "img", "products")
os.makedirs(IMG_DIR, exist_ok=True)
BASE = "https://quangloi.com.vn/"
UA = {"User-Agent": "Mozilla/5.0"}


def quote_url(u):
    p = urllib.parse.urlsplit(u)
    return urllib.parse.urlunsplit((p.scheme, p.netloc, urllib.parse.quote(p.path, safe="/%"), p.query, ""))


def get(url, binary=False, tries=3):
    err = None
    for _ in range(tries):
        try:
            d = urllib.request.urlopen(urllib.request.Request(quote_url(url), headers=UA), timeout=30).read()
            return d if binary else d.decode("utf-8", "replace")
        except Exception as e:  # noqa
            err = e
    raise err


BLOCK = re.compile(r'<div class="(?:item )?product-style">(.*?)<div class="add-to-cart', re.S)


def parse(page):
    out = []
    for b in BLOCK.findall(page):
        a = re.search(r'<a href="([^"]+)" title="([^"]+)">\s*<img[^>]+src="([^"]+)"', b)
        if not a:
            continue
        link, name, img = a.groups()
        pr = re.search(r'class="price[^"]*">(.*?)</p>', b, re.S)
        ptxt = re.sub(r"<[^>]+>", " ", pr.group(1)) if pr else ""
        nums = re.findall(r"\d[\d.,]{3,}", ptxt)
        price = int(re.sub(r"\D", "", nums[0])) if nums else 0
        out.append({"name": html.unescape(name).strip(), "link": link, "img": img, "price": price})
    return out


def internal_links(page):
    return {l for l in re.findall(r'href="(https://quangloi\.com\.vn/[^"#?]*)"', page)}


# ---------- 1. crawl ----------
home = get(BASE)
queue = sorted(internal_links(home))
seen_pages, products, seen_prod = set(), [], set()
while queue:
    batch = [u for u in queue if u not in seen_pages]
    queue = []
    if not batch:
        break
    for u in batch:
        seen_pages.add(u)

    def work(u):
        try:
            return u, get(u)
        except Exception as e:  # noqa
            return u, ""

    with ThreadPoolExecutor(8) as ex:
        results = list(ex.map(work, batch))
    for u, page in results:
        if not page:
            continue
        got = parse(page)
        if got:
            # chỉ đi tiếp phân trang của trang danh mục
            for pg in re.findall(r'data-ci-pagination-page="\d+"|href="(https://quangloi\.com\.vn/[^"]+/\d+)"', page):
                if pg and pg not in seen_pages:
                    queue.append(pg)
        for p in got:
            if p["link"] not in seen_prod:
                seen_prod.add(p["link"])
                products.append(p)
    print("pages", len(seen_pages), "products", len(products))

# ---------- 2. phân loại ----------
def classify(n):
    s = n.lower()
    if re.search(r"cho thuê|thuê máy", s): return "cho-thue"
    if "mã vạch" in s or "newland" in s: return "ma-vach"
    if re.search(r"hút ẩm|lọc không khí", s): return "hut-am"
    if "hủy" in s: return "may-huy"
    if "đếm tiền" in s: return "may-dem-tien"
    if re.search(r"máy chiếu|projector|optoma|panasonic pt", s): return "may-chieu"
    if re.search(r"hộp mực|mực |màn hình|linh kiện|trống|drum|toner", s): return "vat-tu"
    if re.search(r"scan|scanner|máy quét", s): return "may-scan"
    if re.search(r"photocopy|photo |imagerunner|ir[- ]?adv|apeos|\bmp ?\d|\bim ?\d|aficio|e-?studio|bizhub|máy cũ", s): return "may-photocopy"
    if re.search(r"máy in|printer|lbp|laserjet|pixma|in kim|in hóa đơn|bằng tốt nghiệp", s): return "may-in"
    return "khac"


BRANDS = [("Canon", r"canon|imagerunner|ir[- ]?adv"), ("Ricoh", r"ricoh"), ("Fujifilm", r"fuji|apeos"),
          ("Konica Minolta", r"konica|minolta|bizhub"), ("Sharp", r"sharp"), ("Toshiba", r"toshiba|e-?studio"),
          ("Brother", r"brother"), ("HP", r"\bhp\b|laserjet|officejet"), ("Epson", r"epson"), ("Kosmen", r"kosmen"),
          ("FujiE", r"fujie"), ("Coway", r"coway"), ("Kasami", r"kasami"), ("Newland", r"newland|hr\d{2}"),
          ("Weier", r"weier"), ("New United", r"new ?united"), ("Bingo", r"bingo"), ("Magitech", r"magitech"),
          ("Silicon", r"silicon"), ("Balion", r"balion"), ("Kodak", r"kodak"), ("Plustek", r"plustek"),
          ("Fujitsu", r"fujitsu"), ("Optoma", r"optoma"), ("Sony", r"sony"), ("Panasonic", r"panasonic"),
          ("Pantum", r"pantum"), ("Modul", r"modul"), ("Xiudun", r"xiudun")]


def brand_of(n):
    s = n.lower()
    for b, rx in BRANDS:
        if re.search(rx, s): return b
    return ""


for i, p in enumerate(products, 1):
    p["id"] = f"QL{i:03d}"
    p["slug"] = p["link"].rstrip("/").split("/")[-1]
    p["category"] = classify(p["name"])
    p["brand"] = brand_of(p["name"])


# ---------- 3. ảnh + chi tiết (song song) ----------
def clean_lines(s):
    s = re.sub(r"<br\s*/?>|</p>|</li>|</tr>|</div>", "\n", s, flags=re.I)
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s).replace("\xa0", " ")
    return [re.sub(r"\s+", " ", l).strip(" •●-\t") for l in s.split("\n") if l.strip(" •●-\t\xa0")]


def enrich(p):
    # ảnh
    src = urllib.parse.urljoin(BASE, p["img"])
    ext = os.path.splitext(p["img"])[1].lower() or ".jpg"
    fn = f"{p['id']}-{hashlib.md5(p['link'].encode()).hexdigest()[:6]}{ext}"
    dest = os.path.join(IMG_DIR, fn)
    try:
        if not os.path.exists(dest):
            open(dest, "wb").write(get(src, binary=True))
        p["image"] = "img/products/" + fn
    except Exception:
        p["image"] = ""
    p.pop("img", None)
    # chi tiết
    try:
        h = get(p["link"])
    except Exception:
        h = ""
    short = re.search(r'class="short_content">(.*?)</div>', h, re.S)
    p["short"] = clean_lines(short.group(1)) if short else []
    org = re.search(r"Xuất xứ:\s*<span[^>]*>(.*?)</span>", h, re.S)
    p["origin"] = html.unescape(re.sub(r"<[^>]+>", "", org.group(1))).strip() if org else ""
    br = re.search(r"Thương hiệu:\s*<a[^>]*>\s*<span[^>]*>(.*?)</span>", h, re.S)
    if br:
        b = html.unescape(re.sub(r"<[^>]+>", "", br.group(1))).strip()
        if b: p["brand"] = p["brand"] or b
    st = re.search(r"Trạng thái:\s*([^<]+)<", h)
    p["status"] = st.group(1).strip() if st else "Còn hàng"
    tab = re.search(r'id="home">(.*?)</div><div role="tabpanel"', h, re.S)
    specs = clean_lines(tab.group(1)) if tab else []
    cut = next((i for i, l in enumerate(specs) if "CÔNG TY THƯƠNG MẠI" in l.upper() or l.upper().startswith("ĐỊA CHỈ")), len(specs))
    p["specs"] = specs[:cut][:40]
    return p


with ThreadPoolExecutor(8) as ex:
    products = list(ex.map(enrich, products))

products = [p for p in products if p["image"] and p["category"] != "khac"] + \
           [p for p in products if p["image"] and p["category"] == "khac"]
os.makedirs(os.path.join(ROOT, "data"), exist_ok=True)
with open(os.path.join(ROOT, "data", "products.js"), "w", encoding="utf-8") as f:
    f.write("window.QL_PRODUCTS = " + json.dumps(products, ensure_ascii=False, indent=1) + ";\n")
from collections import Counter
print("TOTAL", len(products), "priced", sum(1 for p in products if p["price"]), "specs", sum(1 for p in products if p["specs"]))
print(Counter(p["category"] for p in products))
print(Counter(p["brand"] for p in products).most_common(12))
