# -*- coding: utf-8 -*-
"""Bổ sung chi tiết (thông số, xuất xứ, thương hiệu, mô tả) cho products.js"""
import re, json, os, sys, html, urllib.request, urllib.parse
sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PJ = os.path.join(ROOT, "data", "products.js")
BASE = "https://quangloi.com.vn/"
UA = {"User-Agent": "Mozilla/5.0"}

def get(url, binary=False):
    d = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30).read()
    return d if binary else d.decode("utf-8", "replace")

def clean(s):
    s = re.sub(r"<br\s*/?>|</p>|</li>|</tr>", "\n", s, flags=re.I)
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s).replace("\xa0", " ")
    return [re.sub(r"\s+", " ", l).strip(" •●-\t") for l in s.split("\n") if l.strip(" •●-\t\xa0")]

txt = open(PJ, encoding="utf-8").read()
products = json.loads(txt[txt.index("["):txt.rindex("]") + 1])
for n, p in enumerate(products, 1):
    try:
        h = get(p["link"])
    except Exception as e:
        print("ERR", p["link"], e); continue
    short = re.search(r'class="short_content">(.*?)</div>', h, re.S)
    p["short"] = clean(short.group(1)) if short else []
    org = re.search(r"Xuất xứ:\s*<span[^>]*>(.*?)</span>", h, re.S)
    p["origin"] = html.unescape(re.sub(r"<[^>]+>", "", org.group(1))).strip() if org else ""
    br = re.search(r"Thương hiệu:\s*<a[^>]*>\s*<span[^>]*>(.*?)</span>", h, re.S)
    p["brand"] = html.unescape(re.sub(r"<[^>]+>", "", br.group(1))).strip() if br else ""
    st = re.search(r"Trạng thái:\s*([^<]+)<", h)
    p["status"] = st.group(1).strip() if st else "Còn hàng"
    tab = re.search(r'id="home">(.*?)</div><div role="tabpanel"', h, re.S)
    specs = clean(tab.group(1)) if tab else []
    cut = next((i for i, l in enumerate(specs) if "CÔNG TY THƯƠNG MẠI" in l.upper() or l.upper().startswith("ĐỊA CHỈ")), len(specs))
    p["specs"] = specs[:cut][:30]
    if n % 10 == 0:
        print(n, "/", len(products))
with open(PJ, "w", encoding="utf-8") as f:
    f.write("window.QL_PRODUCTS = " + json.dumps(products, ensure_ascii=False, indent=1) + ";\n")
print("DONE", len(products), "with specs:", sum(1 for p in products if p["specs"]))

