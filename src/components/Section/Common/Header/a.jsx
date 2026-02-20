 function MyFunctionCodes() {
  const router = useRouter();

  const isBrowser = typeof window !== "undefined";
  const protocol =
    isBrowser && window.location.protocol === "https:" ? "https" : "http";

  const API_BASE =
    protocol === "https"
      ? "https://waveledserver.vercel.app"
      : "http://localhost:4000";

  const IMG_HOST =
    protocol === "https"
      ? "https://waveledserver.vercel.app"
      : "http://localhost:4000";

  function normalizeImg(src) {
    if (!src) return "";
    const s = String(src);
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
    return `${IMG_HOST}${s.startsWith("/") ? "" : "/"}${s}`;
  }

  async function fetchJson(url) {
    const r = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data?.error || "Falha ao carregar");
    return data;
  }

 
  const CACHE_REVALIDATE_MS = 60 * 60 * 1000; 
  const CACHE_BACKGROUND_REFRESH_MS = 2 * 60 * 60 * 1000; 

  const memoryCacheRef = useRef(Object.create(null));

  function hasLocalStorage() {
    if (!isBrowser) return false;
    try {
      const k = "__wl_ls_test__";
      window.localStorage.setItem(k, "1");
      window.localStorage.removeItem(k);
      return true;
    } catch {
      return false;
    }
  }

  function safeParseJSON(s) {
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
  }

  function readCache(key) { 
    const now = Date.now();
    const lsOk = hasLocalStorage();

    if (lsOk) {
      const raw = window.localStorage.getItem(key);
      if (!raw) return { hit: false };
      const parsed = safeParseJSON(raw);
      if (!parsed || typeof parsed !== "object") return { hit: false };

      const ts = Number(parsed.ts || 0);
      const age = now - ts;
      return {
        hit: true,
        fresh: age <= CACHE_REVALIDATE_MS,
        ts,
        data: parsed.data,
      };
    }

    const mem = memoryCacheRef.current[key];
    if (!mem) return { hit: false };
    const ts = Number(mem.ts || 0);
    const age = now - ts;
    return { hit: true, fresh: age <= CACHE_REVALIDATE_MS, ts, data: mem.data };
  }

  function writeCache(key, data) {
    const payload = { ts: Date.now(), data };
    const lsOk = hasLocalStorage();
    if (lsOk) {
      try {
        window.localStorage.setItem(key, JSON.stringify(payload));
        return;
      } catch {
 
      }
    }
    memoryCacheRef.current[key] = payload;
  }

  async function getCachedOrFetch({ key, url }) {
    const cached = readCache(key);
    if (cached.hit && cached.fresh) {
      return { data: cached.data, fromCache: true };
    }
    const fresh = await fetchJson(url);
    writeCache(key, fresh);
    return { data: fresh, fromCache: false };
  }

 
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const closeTimerRef = useRef(null);

  const HOVER_OPEN_DELAY_MS = 500;
  const hoverTimerRef = useRef(null);

  function clearCloseTimer() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function clearHoverTimer() {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setOpen(false), 160);
  }

  function closeNow() {
    clearCloseTimer();
    clearHoverTimer();
    setOpen(false);
  }

  useEffect(() => {
    return () => {
      clearCloseTimer();
      clearHoverTimer();
    };
  }, []);

  function goTo(url) {
    closeNow();
    router.push(url);
  }

  function goToProduct(id) {
    if (!id) return;
    goTo(`/single-shop?product=${encodeURIComponent(id)}`);
  }

  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });

  function updateMenuPosition() {
    const el = triggerRef.current;
    if (!el || !isBrowser) return;
    const rect = el.getBoundingClientRect();
    const gap = 12;
    const top = Math.round(rect.bottom + gap);
    setMenuPos({ top, left: 0, width: window.innerWidth });
  }

  useEffect(() => {
    if (!open) return;
    updateMenuPosition();

    const onScroll = () => updateMenuPosition();
    const onResize = () => updateMenuPosition();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  useEffect(() => {
    function onDown(e) {
      if (!open) return;
      const t = e.target;
      const trig = triggerRef.current;
      const menu = menuRef.current;

      const insideTrigger = trig && trig.contains(t);
      const insideMenu = menu && menu.contains(t);

      if (!insideTrigger && !insideMenu) setOpen(false);
    }

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

 
  const [sliderItems, setSliderItems] = useState([]);
  const [sliderLoading, setSliderLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    const CACHE_KEY = "wl_cache_vertical_solutions_featured_1";

    async function loadSlider({ background = false } = {}) {
      if (!background) setSliderLoading(true);
      try {
        const url = `${API_BASE}/api/cms/vertical-solutions?featured=1`;
        const { data } = await getCachedOrFetch({ key: CACHE_KEY, url });

        const list = (data?.data || []).map((x) => ({
          title: x?.wl_title || "Solução",
          desc: x?.wl_description || "",
          image: normalizeImg(x?.wl_image),
          id: x?.wl_product?._id || "",
        }));

        if (alive) setSliderItems(list);
      } catch {
        if (alive && !background) setSliderItems([]);
      } finally {
        if (alive && !background) setSliderLoading(false);
      }
    }

    loadSlider();

    // refresh em background a cada 2h (mantém cache atualizado)
    let t = null;
    if (isBrowser) {
      t = setInterval(() => {
        loadSlider({ background: true }).catch(() => {});
      }, CACHE_BACKGROUND_REFRESH_MS);
    }

    return () => {
      alive = false;
      if (t) clearInterval(t);
    };
  }, [API_BASE]);

  const [idx, setIdx] = useState(0);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (!open || pause || !sliderItems.length) return;
    const t = setInterval(() => {
      setIdx((p) => (p + 1) % sliderItems.length);
    }, 4500);
    return () => clearInterval(t);
  }, [open, pause, sliderItems.length]);

  useEffect(() => {
    if (open) setIdx(0);
  }, [open]);

  function next() {
    if (!sliderItems.length) return;
    setIdx((p) => (p + 1) % sliderItems.length);
  }

  function prev() {
    if (!sliderItems.length) return;
    setIdx((p) => (p - 1 + sliderItems.length) % sliderItems.length);
  }

  useEffect(() => {
    function onKey(e) {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const current =
    sliderItems[idx] || {
      title: "WaveLED — Produtos & Soluções",
      desc: "Venda, montagem e aluguer com suporte técnico completo.",
      image: "",
      id: "",
    };

 
  const [tabs, setTabs] = useState([]);
  const [tabsLoading, setTabsLoading] = useState(false);

  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [activeTabKey, setActiveTabKey] = useState("");
  const [activeSubId, setActiveSubId] = useState("all");

  useEffect(() => {
    let alive = true;

    const CACHE_KEY = "wl_cache_categories_with_subcategories";

    async function loadCategoriesWithSubs({ background = false } = {}) {
      if (!background) setTabsLoading(true);
      try { 
        const url = `${API_BASE}/api/categories-with-subcategories?_ts=${Date.now()}`;
        const { data } = await getCachedOrFetch({ key: CACHE_KEY, url });

        const list = data?.data || [];
        const arr = Array.isArray(list)
          ? list.map((c) => ({
              id: String(c._id),
              key: String(c.wl_slug || c._id),
              label: String(c.wl_name || "Categoria"),
              heading: String(c.wl_name || "Categoria"),
              subcategories: Array.isArray(c.subcategories) ? c.subcategories : [],
              wl_order: typeof c.wl_order === "number" ? c.wl_order : 0,
            }))
          : [];

        arr.sort((a, b) => (a.wl_order || 0) - (b.wl_order || 0));

        if (!alive) return;

        setTabs(arr);

        const first = arr[0] || null;
        if (first) {
          setActiveTabKey((prev) => prev || first.key);
          setActiveCategoryId((prev) => prev || first.id);
        } else {
          setActiveTabKey("");
          setActiveCategoryId("");
        }
      } catch {
        if (alive && !background) {
          setTabs([]);
          setActiveTabKey("");
          setActiveCategoryId("");
        }
      } finally {
        if (alive && !background) setTabsLoading(false);
      }
    }

    loadCategoriesWithSubs();

    let t = null;
    if (isBrowser) {
      t = setInterval(() => {
        loadCategoriesWithSubs({ background: true }).catch(() => {});
      }, CACHE_BACKGROUND_REFRESH_MS);
    }

    return () => {
      alive = false;
      if (t) clearInterval(t);
    };
  }, [API_BASE]);

  const activeCategory = useMemo(() => {
    return tabs.find((t) => t.id === activeCategoryId) || null;
  }, [tabs, activeCategoryId]);

  const visibleSubcategories = useMemo(() => {
    const subs = activeCategory?.subcategories || [];
    return subs.slice().sort((a, b) =>
      String(a?.wl_name || "").localeCompare(String(b?.wl_name || ""))
    );
  }, [activeCategory]);

 
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!activeCategoryId) return;

    async function loadProductsByCategory({ background = false } = {}) {
      if (!background) setProductsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("category", activeCategoryId);

        if (activeSubId && activeSubId !== "all") {
          params.set("subcategory", activeSubId);
        }

        const url = `${API_BASE}/api/products?${params.toString()}`;
        const cacheKey = `wl_cache_products_${activeCategoryId}_${activeSubId || "all"}`;

        const { data } = await getCachedOrFetch({ key: cacheKey, url });
        if (alive) setProducts(data?.data || []);
      } catch {
        if (alive && !background) setProducts([]);
      } finally {
        if (alive && !background) setProductsLoading(false);
      }
    }

    loadProductsByCategory();
 
    let t = null;
    if (isBrowser) {
      t = setInterval(() => {
        loadProductsByCategory({ background: true }).catch(() => {});
      }, CACHE_BACKGROUND_REFRESH_MS);
    }

    return () => {
      alive = false;
      if (t) clearInterval(t);
    };
  }, [API_BASE, activeCategoryId, activeSubId]);

  const productWrapperRef = useRef(null);
  const autoExpandRef = useRef(false);

 
  const tabsScrollerRef = useRef(null);
  const [tabsOverflow, setTabsOverflow] = useState(false);
  const [tabsAtLeft, setTabsAtLeft] = useState(true);
  const [tabsAtRight, setTabsAtRight] = useState(false);

  useEffect(() => {
    const el = tabsScrollerRef.current;
    if (!el) return;

    let raf = 0;
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const overflow = el.scrollWidth > el.clientWidth + 2;
        const left = el.scrollLeft <= 1;
        const right = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
        setTabsOverflow(overflow);
        setTabsAtLeft(left);
        setTabsAtRight(right);
      });
    };

    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [tabs.length, open]);

  function scrollTabs(dir) {
    const el = tabsScrollerRef.current;
    if (!el) return;
    const step = Math.max(180, Math.round(el.clientWidth * 0.65));
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

 
  const [initialCount, setInitialCount] = useState(6);
  const [showAll, setShowAll] = useState(false);

  const [hasScroll, setHasScroll] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [wasAtBottomByButton, setWasAtBottomByButton] = useState(false);

  useEffect(() => {
    if (!isBrowser) return;

    const calc = () => {
      const w = window.innerWidth;
      if (w >= 1500) return 12;
      if (w >= 1300) return 10;
      if (w >= 1100) return 9;
      if (w >= 900) return 8;
      if (w >= 700) return 6;
      return 6;
    };

    const apply = () => setInitialCount(calc());
    apply();

    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [isBrowser]);

  useEffect(() => {
    autoExpandRef.current = false;
    setShowAll(false);
    setWasAtBottomByButton(false);

    requestAnimationFrame(() => {
      const el = productWrapperRef.current;
      if (el) el.scrollTo({ top: 0 });
    });
  }, [activeCategoryId, activeSubId]);

  const visibleProducts = useMemo(() => {
    const min = Math.max(5, initialCount);
    return showAll ? products : products.slice(0, min);
  }, [products, showAll, initialCount]);

  useEffect(() => {
    const el = productWrapperRef.current;
    if (!el) return;

    let raf = 0;
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const overflow = el.scrollHeight > el.clientHeight + 2;
        const bottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
        setHasScroll(overflow);
        setAtBottom(overflow ? bottom : true);
        if (!bottom) setWasAtBottomByButton(false);

        if (!showAll && overflow) {
          const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 48;
          if (nearBottom && !autoExpandRef.current) {
            autoExpandRef.current = true;
            setShowAll(true);
            requestAnimationFrame(() => {
              el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
              setTimeout(() => {
                const bottomNow =
                  el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
                if (bottomNow) setWasAtBottomByButton(true);
              }, 420);
            });
          }
        }
      });
    };

    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [open, productsLoading, visibleProducts.length, showAll]);

  const showButton = useMemo(() => {
    if (productsLoading) return false;
    if (!products?.length) return false;
    if (!hasScroll) return false;
    if (!showAll) return true;
    if (atBottom && wasAtBottomByButton) return false;
    return !atBottom;
  }, [productsLoading, products, hasScroll, showAll, atBottom, wasAtBottomByButton]);

  function handleSeeMore() {
    const el = productWrapperRef.current;
    if (!el) return;

    if (!showAll) {
      setShowAll(true);
      requestAnimationFrame(() => {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
        setTimeout(() => {
          const bottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
          if (bottom) setWasAtBottomByButton(true);
        }, 420);
      });
      return;
    }

    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    setTimeout(() => {
      const bottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
      if (bottom) setWasAtBottomByButton(true);
    }, 420);
  }

 
  useEffect(() => {
    const el = productWrapperRef.current;
    if (!el) return;

    let touchStartY = 0;

    function onTouchStart(e) {
      if (!e.touches || e.touches.length === 0) return;
      touchStartY = e.touches[0].clientY;
    }

    function onTouchMove(e) {
      if (!e.touches || e.touches.length === 0) return;
      const currentY = e.touches[0].clientY;
      const dy = touchStartY - currentY;
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

      if ((dy < 0 && atTop) || (dy > 0 && atBottom)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    function onWheel(e) {
      const delta = e.deltaY;
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

      if ((delta < 0 && atTop) || (delta > 0 && atBottom)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [open, visibleProducts.length]); 

  const hasMenuContent =
    tabsLoading ||
    productsLoading ||
    (tabs && tabs.length > 0) ||
    (products && products.length > 0) ||
    (sliderItems && sliderItems.length > 0); 
}
