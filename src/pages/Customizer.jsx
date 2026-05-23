import { AnimatePresence, motion } from "framer-motion";
import { useState, Suspense } from "react";
import { useSnapshot } from "valtio";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import state from "../store";
import { fadeAnimation, slideAnimation } from "../config/motion";
import { ColorPicker } from "../components";
import MeshPreview from "../canvas/MeshPreview";

// ─── Product Catalog ─────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: "shirt",
    meshName: "Shirt",
    colorKey: "shirtColor",
    name: "Urban Flex Hoodie",
    description: "Premium heavyweight cotton blend. Relaxed drop-shoulder silhouette with a kangaroo pocket and ribbed cuffs.",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.7,
    reviews: 284,
    badge: "Best Seller",
    camera: { position: [0, 0, 1.6], fov: 44 },
  },
  {
    id: "pants",
    meshName: "Pants",
    colorKey: "pantsColor",
    name: "TechFit Cargo Pants",
    description: "Water-resistant stretch fabric with articulated knees. Six-pocket utility design built for urban exploration.",
    price: 74.99,
    originalPrice: 109.99,
    rating: 4.5,
    reviews: 196,
    badge: "New Drop",
    camera: { position: [0, 0, 1.8], fov: 44 },
  },
  {
    id: "shoes",
    meshName: "Shoes_pair",
    colorKey: "shoesColor",
    name: "CloudStep Runners",
    description: "Engineered mesh upper with responsive EVA foam midsole. Ultra-lightweight at just 218g per shoe.",
    price: 119.99,
    originalPrice: 159.99,
    rating: 4.9,
    reviews: 512,
    badge: "Top Rated",
    camera: { position: [0, 0, 1.4], fov: 44 },
  },
];

// ─── Star Rating ─────────────────────────────────────────────────────────────
const StarRating = ({ rating }) => {
  return (
    <div className="ec-stars">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <svg key={star} viewBox="0 0 24 24" className="ec-star" fill={filled ? "#F59E0B" : half ? "url(#half)" : "none"} stroke="#F59E0B" strokeWidth="1.5">
            {half && (
              <defs>
                <linearGradient id="half">
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        );
      })}
    </div>
  );
};

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, isCustomizing, onCustomize }) => {
  const snap = useSnapshot(state);
  const currentColor = snap[product.colorKey];
  const isWishlisted = snap.wishlist.includes(product.id);
  const isInCart = snap.cart.includes(product.id);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      state.wishlist = state.wishlist.filter((id) => id !== product.id);
    } else {
      state.wishlist.push(product.id);
    }
  };

  const toggleCart = (e) => {
    e.stopPropagation();
    if (isInCart) {
      state.cart = state.cart.filter((id) => id !== product.id);
    } else {
      state.cart.push(product.id);
    }
  };

  return (
    <motion.div
      className={`ec-card ${isCustomizing ? "ec-card--active" : ""}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      whileHover={{ y: -6 }}
      style={{ "--accent": currentColor }}
    >
      {/* Badge */}
      <div className="ec-badge">{product.badge}</div>

      {/* Wishlist */}
      <button
        className={`ec-wishlist ${isWishlisted ? "ec-wishlist--active" : ""}`}
        onClick={toggleWishlist}
        aria-label="Toggle wishlist"
      >
        <svg viewBox="0 0 24 24" fill={isWishlisted ? "#ef4444" : "none"} stroke={isWishlisted ? "#ef4444" : "#9ca3af"} strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* 3D Canvas Preview */}
      <div className="ec-canvas-area">
        <div className="ec-canvas-bg" style={{ "--accent": currentColor }} />
        <Canvas
          camera={product.camera}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent", width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 6, 4]} intensity={1.4} castShadow />
          <directionalLight position={[-4, 2, -4]} intensity={0.4} />
          <Environment preset="city" />
          <Suspense fallback={null}>
            <MeshPreview meshName={product.meshName} color={currentColor} />
          </Suspense>
        </Canvas>

        {/* Color chip overlay */}
        <div className="ec-color-chip" style={{ background: currentColor }} />
      </div>

      {/* Product Info */}
      <div className="ec-info">
        <div className="ec-info-top">
          <h3 className="ec-name">{product.name}</h3>
          <div className="ec-rating-row">
            <StarRating rating={product.rating} />
            <span className="ec-reviews">({product.reviews})</span>
          </div>
          <p className="ec-desc">{product.description}</p>
        </div>

        <div className="ec-info-bottom">
          <div className="ec-price-row">
            <span className="ec-price">${product.price.toFixed(2)}</span>
            <span className="ec-original-price">${product.originalPrice.toFixed(2)}</span>
            <span className="ec-discount">-{discount}%</span>
          </div>

          <div className="ec-actions">
            <button
              className={`ec-btn-customize ${isCustomizing ? "ec-btn-customize--active" : ""}`}
              onClick={() => onCustomize(product.id)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ec-btn-icon">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
              </svg>
              {isCustomizing ? "Customizing…" : "Customize"}
            </button>

            <button
              className={`ec-btn-cart ${isInCart ? "ec-btn-cart--added" : ""}`}
              onClick={toggleCart}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ec-btn-icon">
                {isInCart ? (
                  <path d="M20 6L9 17l-5-5" />
                ) : (
                  <>
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </>
                )}
              </svg>
              {isInCart ? "Added!" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Customizer View (shows when a product is selected for editing) ──────────
const CustomizerView = ({ productId, onBack }) => {
  const snap = useSnapshot(state);
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return null;

  const currentColor = snap[product.colorKey];
  const isInCart = snap.cart.includes(product.id);
  const isWishlisted = snap.wishlist.includes(product.id);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      state.wishlist = state.wishlist.filter((id) => id !== product.id);
    } else {
      state.wishlist.push(product.id);
    }
  };

  const toggleCart = (e) => {
    e.stopPropagation();
    if (isInCart) {
      state.cart = state.cart.filter((id) => id !== product.id);
    } else {
      state.cart.push(product.id);
    }
  };

  return (
    <motion.div
      className="ec-single-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      style={{ "--accent": currentColor }}
    >
      {/* ── Left Side: Large 3D Canvas Preview ── */}
      <div className="ec-single-canvas-area">
        <div className="ec-canvas-bg" style={{ "--accent": currentColor }} />
        
        {/* Dynamic Badge */}
        <div className="ec-single-badge">{product.badge}</div>
        
        {/* Wishlist Button */}
        <button
          className={`ec-single-wishlist ${isWishlisted ? "ec-wishlist--active" : ""}`}
          onClick={toggleWishlist}
          aria-label="Toggle wishlist"
        >
          <svg viewBox="0 0 24 24" fill={isWishlisted ? "#ef4444" : "none"} stroke={isWishlisted ? "#ef4444" : "#4b5563"} strokeWidth="2.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Large Canvas */}
        <Canvas
          camera={product.camera}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent", width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[5, 8, 5]} intensity={1.6} castShadow />
          <directionalLight position={[-5, 3, -5]} intensity={0.5} />
          <Environment preset="city" />
          <Suspense fallback={null}>
            <MeshPreview meshName={product.meshName} color={currentColor} />
          </Suspense>
          <OrbitControls enableZoom={true} enablePan={true} minDistance={0.8} maxDistance={3.5} />
        </Canvas>
        
        {/* Interactive hint */}
        <div className="ec-canvas-hint">Drag to rotate • Scroll to zoom</div>
      </div>

      {/* ── Right Side: Customization & Info Panel ── */}
      <div className="ec-single-panel">
        {/* Breadcrumb / Back Button */}
        <button className="ec-single-back-link" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to collection
        </button>

        <div className="ec-single-info-container">
          <div className="ec-rating-row">
            <StarRating rating={product.rating} />
            <span className="ec-reviews">({product.reviews} customer reviews)</span>
          </div>
          <h1 className="ec-single-name">{product.name}</h1>
          
          <div className="ec-single-price-row">
            <span className="ec-single-price">${product.price.toFixed(2)}</span>
            <span className="ec-single-original-price">${product.originalPrice.toFixed(2)}</span>
            <span className="ec-single-discount">-{discount}% OFF</span>
          </div>

          <p className="ec-single-desc">{product.description}</p>
        </div>

        <hr className="ec-single-divider" />

        {/* Color Studio */}
        <div className="ec-single-studio">
          <h3 className="ec-studio-title">
            <span className="ec-studio-dot" style={{ background: currentColor }} />
            Customize Color
          </h3>
          <p className="ec-studio-subtitle">Choose a swatch or pick a custom hex value from the spectrum</p>
          
          {/* Quick Swatches */}
          <div className="ec-single-swatches">
            {["#5B8CFF","#FF6B6B","#48BB78","#ED8936","#9F7AEA","#F6E05E","#FC8181","#1A1A2E","#E2E8F0","#2D3748"].map((hex) => (
              <button
                key={hex}
                className="ec-single-swatch"
                style={{ 
                  background: hex, 
                  outline: currentColor === hex ? `3px solid ${hex}` : "none", 
                  outlineOffset: "2px" 
                }}
                onClick={() => { state[product.colorKey] = hex; }}
                aria-label={hex}
              />
            ))}
          </div>

          {/* Color Picker */}
          <div className="ec-single-picker">
            <ColorPicker inline />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="ec-single-actions">
          <button
            className={`ec-single-btn-cart ${isInCart ? "ec-btn-cart--added" : ""}`}
            onClick={toggleCart}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ec-btn-icon">
              {isInCart ? (
                <path d="M20 6L9 17l-5-5" />
              ) : (
                <>
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </>
              )}
            </svg>
            {isInCart ? "Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Customizer / Shop Page ──────────────────────────────────────────────
const Customizer = () => {
  const snap = useSnapshot(state);
  const cartCount = snap.cart.length;
  const wishlistCount = snap.wishlist.length;

  const handleCustomize = (productId) => {
    if (snap.selectedMesh === productId) {
      state.selectedMesh = null;
    } else {
      state.selectedMesh = productId;
    }
  };

  const handleGoBack = () => {
    state.intro = true;
    state.selectedMesh = null;
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <motion.div
          key="shop-page"
          className="ec-page"
          {...fadeAnimation}
        >
          {/* ── Top Nav Bar ── */}
          <motion.div className="ec-navbar" {...slideAnimation("down")}>
            <button className="ec-back-btn" onClick={handleGoBack}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Back
            </button>

            <div className="ec-nav-title">
              <span className="ec-nav-brand">ULTIMEZ</span>
              <span className="ec-nav-sub">Studio Collection</span>
            </div>

            <div className="ec-nav-icons">
              <button className="ec-nav-icon-btn" aria-label="Wishlist">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {wishlistCount > 0 && <span className="ec-badge-count">{wishlistCount}</span>}
              </button>
              <button className="ec-nav-icon-btn" aria-label="Cart">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {cartCount > 0 && <span className="ec-badge-count">{cartCount}</span>}
              </button>
            </div>
          </motion.div>

          {/* ── Page Body ── */}
          <div className="ec-body">
            <AnimatePresence mode="wait">
              {snap.selectedMesh ? (
                <CustomizerView
                  key="customizer-view"
                  productId={snap.selectedMesh}
                  onBack={() => { state.selectedMesh = null; }}
                />
              ) : (
                <motion.div
                  key="grid-view"
                  className="ec-grid"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="ec-grid-header">
                    <h1 className="ec-grid-title">Shop the Collection</h1>
                    <p className="ec-grid-subtitle">Click <strong>Customize</strong> to personalize any item with your own color.</p>
                  </div>

                  <div className="ec-cards-grid">
                    {PRODUCTS.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 24 }}
                      >
                        <ProductCard
                          product={product}
                          isCustomizing={snap.selectedMesh === product.id}
                          onCustomize={handleCustomize}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
