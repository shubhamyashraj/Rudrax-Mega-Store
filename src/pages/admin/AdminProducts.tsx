import React, { useState } from 'react';
import { useRudrax } from '../../app/StateContext';
import { Product } from '../../models/types';
import { Badge, Input, Button } from '../../components/ui/atoms';
import { 
  Plus, Trash2, Edit2, Upload, Sparkles, Layers, Info, Check, FileJson, AlertTriangle, Search, CheckCircle
} from 'lucide-react';

interface SpecField {
  key: string;
  label: string;
  placeholder: string;
}

const CATEGORY_TEMPLATES: Record<string, SpecField[]> = {
  Electronics: [
    { key: "Voltage", label: "Voltage Input", placeholder: "e.g. 220V - 240V AC" },
    { key: "Power", label: "Power Output (Watts)", placeholder: "e.g. 75W, 1200RPM" },
    { key: "Warranty", label: "Official Warranty Term", placeholder: "e.g. 2 Years Brand Warranty" }
  ],
  Clothing: [
    { key: "Color", label: "Primary Hue / Color", placeholder: "e.g. Crimson Red" },
    { key: "Size", label: "Available Sizes", placeholder: "e.g. S, M, L, XL" },
    { key: "Fabric", label: "Fabric Material", placeholder: "e.g. 100% Organic Cotton" },
    { key: "Gender", label: "Target Gender profile", placeholder: "e.g. Unisex, Men" }
  ],
  Grocery: [
    { key: "Weight", label: "Unit net weight", placeholder: "e.g. 1kg, 5kg" },
    { key: "Shelf Life", label: "Standard Shelf Life", placeholder: "e.g. 12 Months from packing" },
    { key: "Organic Status", label: "Organic Certified", placeholder: "e.g. Yes / Organic Certified" }
  ],
  Seeds: [
    { key: "Crop", label: "Crop Sown Variant", placeholder: "e.g. Hybrid Basmati Rice Seeds" },
    { key: "Season", label: "Sowing Season", placeholder: "e.g. Kharif (Sowing: June - July)" },
    { key: "Germination Rate", label: "Germination Success Rate", placeholder: "e.g. 95% Minimum" }
  ],
  Plants: [
    { key: "Sunlight", label: "Sunlight Requirement", placeholder: "e.g. Partial light / Direct" },
    { key: "Water Requirement", label: "Watering guidelines", placeholder: "e.g. Low (Once a week)" },
    { key: "Height", label: "Standard Potted Height", placeholder: "e.g. 12-18 inches" }
  ],
  "Puja Items": [
    { key: "Material", label: "Construction Material", placeholder: "e.g. Pure Virgin Brass / Sandalwood" },
    { key: "Fragrance Type", label: "Aroma / Fragrance", placeholder: "e.g. Camphor & Jasmine" }
  ],
  "Manufacturing Products": [
    { key: "Inputs Count", label: "Assembly Materials count", placeholder: "e.g. 5 raw elements" },
    { key: "Recipe ID", label: "Recipe Formula Code", placeholder: "e.g. RDX-RECIPE-EBOARD01" }
  ],
  Stationery: [
    { key: "Paper Grade", label: "Paper GSM thickness", placeholder: "e.g. 80 GSM Ultra-white" },
    { key: "Eco Friendly", label: "Eco-Friendly source", placeholder: "e.g. Sourced from recycled bamboo" }
  ]
};

const BULK_PRESETS = [
  {
    title: "Electronics Fan Catalog",
    category: "Electronics",
    data: [
      {
        id: "prod-elec-1",
        name: "Celeste Decorative Ceiling Fan",
        brand: "Havells",
        category: "Electronics",
        subCategory: "Ceiling Fans",
        description: "Elegant high dissipation ceiling fan equipped with noise insulated copper bindings and dual defense bearings.",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
        seoKeywords: "havells fan, 1200mm fan, smart ceiling fan",
        specifications: {
          "Voltage": "220V",
          "Power": "75W",
          "Warranty": "2 Years On-Site",
          "Origin": "Domestic Sourced"
        },
        variants: [
          { name: "White 1200mm", sku: "RDX-FAN-WHT-1200", barcode: "8902020211" },
          { name: "Brown 1400mm", sku: "RDX-FAN-BRN-1400", barcode: "8902020212" }
        ]
      }
    ]
  },
  {
    title: "Cotton Apparel Catalog",
    category: "Clothing",
    data: [
      {
        id: "prod-cloth-1",
        name: "EcoFit Organic Polo Shirt",
        brand: "Rudrax Apparel",
        category: "Clothing",
        subCategory: "T-Shirts",
        description: "Breathable natural crew-neck polo. Made from 100% GOTS certified organic Egyptian cotton with comfort stitching.",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600",
        seoKeywords: "polo t-shirt, sustainable shirts, red cotton shirt",
        specifications: {
          "Color": "Ruby Red",
          "Size": "M, L, XL",
          "Fabric": "100% Organic Cotton",
          "Gender": "Unisex"
        },
        variants: [
          { name: "Size M Pack", sku: "RDX-TSH-RED-M", barcode: "8903322111" },
          { name: "Size L Pack", sku: "RDX-TSH-RED-L", barcode: "8903322112" }
        ]
      }
    ]
  },
  {
    title: "Agronomic Wheat Seeds",
    category: "Seeds",
    data: [
      {
        id: "prod-seed-1",
        name: "Kalyan Sona Wheat Seeds",
        brand: "Rudrax Farms",
        category: "Seeds",
        subCategory: "High Yield Seeds",
        description: "Triple dwarf high moisture-response wheat seeds. Ideal for bumper wheat harvests in north belt soils.",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=600",
        seoKeywords: "wheat seeds, rdx seeds, kalyan sona wheat",
        specifications: {
          "Crop": "Kalyan Sona Wheat",
          "Season": "Rabi Crop (Nov - March)",
          "Germination Rate": "98% Minimum Test Checked"
        },
        variants: [
          { name: "20kg Gunny Bag", sku: "RDX-TUR-20K", barcode: "8904545001" },
          { name: "50kg Bulk Jumbo", sku: "RDX-TUR-50K", barcode: "8904545002" }
        ]
      }
    ]
  }
];

export function AdminProducts() {
  const { products, batches, createProduct, editProduct, deleteProduct } = useRudrax();

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showBulkUpload, setShowBulkUpload] = useState<boolean>(false);
  const [editingProdId, setEditingProdId] = useState<string | null>(null);

  // Filters & Search Scope
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [brandFilter, setBrandFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [stockStatusFilter, setStockStatusFilter] = useState<string>('All');

  // Form Fields - Core
  const [name, setName] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [category, setCategory] = useState<string>('Grocery');
  const [subCategory, setSubCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string>('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600');
  const [seoKeywords, setSeoKeywords] = useState<string>('');

  // Form Category Specification
  const [templatedSpecs, setTemplatedSpecs] = useState<Record<string, string>>({});

  // Dynamic arbitrary specifications space
  const [customSpecs, setCustomSpecs] = useState<{ key: string; value: string }[]>([]);
  const [newCustomKey, setNewCustomKey] = useState<string>('');
  const [newCustomVal, setNewCustomVal] = useState<string>('');

  // Variants in form
  const [variantsList, setVariantsList] = useState<{ name: string; sku: string; barcode: string }[]>([
    { name: '1kg pack', sku: 'RDX-GCR-001', barcode: '8900000001' }
  ]);

  const [err, setErr] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Bulk Upload text state
  const [bulkJson, setBulkJson] = useState<string>(JSON.stringify(BULK_PRESETS[0].data, null, 2));

  const allCategories = [
    "Grocery", "Daily Essentials", "Household", "Personal Care", "Packaged Foods",
    "Electronics", "Clothing", "Stationery", "Seeds", "Plants", "Puja Items", "Manufacturing Products"
  ];

  // Derive list of brands dynamically for filter options
  const uniqueBrands = ['All', ...Array.from(new Set(products.map(p => p.brand))).filter(Boolean)];

  // Filter products engine
  const filteredProductsList = products.filter(p => {
    const matchesSearch = searchFilter.trim() === '' || 
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.seoKeywords.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.variants.some(v => v.sku.toLowerCase().includes(searchFilter.toLowerCase()) || v.barcode.includes(searchFilter));

    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesBrand = brandFilter === 'All' || p.brand === brandFilter;

    // Calculate aggregated inventory stocks
    const totalQty = p.variants.reduce((total, vr) => {
      const vBatches = batches.filter(b => b.productId === p.id && b.variantId === vr.id);
      return total + vBatches.reduce((sum, b) => sum + b.quantity, 0);
    }, 0);

    let matchesStock = true;
    if (stockStatusFilter === 'Out') {
      matchesStock = totalQty === 0;
    } else if (stockStatusFilter === 'Low') {
      matchesStock = totalQty > 0 && totalQty <= 5;
    } else if (stockStatusFilter === 'Healthy') {
      matchesStock = totalQty > 5;
    }

    return matchesSearch && matchesCategory && matchesBrand && matchesStock;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setSuccessMsg('');

    if (!name || !brand || !category || !subCategory || !description || !image) {
      setErr('Please fill out all standard fields.');
      return;
    }

    if (variantsList.length === 0) {
      setErr('Every product variant must have at least one weight/quantity pack format.');
      return;
    }

    const finalSpecifications: Record<string, string> = { ...templatedSpecs };
    customSpecs.forEach(pair => {
      if (pair.key.trim()) {
        finalSpecifications[pair.key.trim()] = pair.value.trim();
      }
    });

    if (editingProdId) {
      const existing = products.find(p => p.id === editingProdId);
      if (existing) {
        const payload: Product = {
          ...existing,
          name,
          brand,
          category,
          subCategory,
          description,
          image,
          seoKeywords,
          specifications: finalSpecifications,
          variants: variantsList.map((formVar) => {
            const matchIndex = existing.variants.find(ef => ef.name === formVar.name || ef.sku === formVar.sku);
            return {
              id: matchIndex?.id || `v-edit-${Math.floor(100 + Math.random() * 900)}`,
              name: formVar.name,
              sku: formVar.sku,
              barcode: formVar.barcode,
              stock: matchIndex?.stock || 0
            };
          })
        };
        editProduct(payload);
        setSuccessMsg(`Product "${name}" successfully updated!`);
      }
      setEditingProdId(null);
    } else {
      const payload = {
        id: `prod-${Math.floor(100 + Math.random() * 900)}`,
        name,
        brand,
        category,
        subCategory,
        description,
        image,
        seoKeywords,
        specifications: finalSpecifications,
        variants: variantsList.map((formVar) => ({
          id: `v-${Math.floor(1000 + Math.random() * 9000)}`,
          name: formVar.name,
          sku: formVar.sku,
          barcode: formVar.barcode
        }))
      };
      createProduct(payload);
      setSuccessMsg(`New retail asset "${name}" published successfully!`);
    }

    setShowAddForm(false);
    resetForm();
  };

  const handleEditTrigger = (p: Product) => {
    setEditingProdId(p.id);
    setName(p.name);
    setBrand(p.brand);
    setCategory(p.category);
    setSubCategory(p.subCategory);
    setDescription(p.description);
    setImage(p.image);
    setSeoKeywords(p.seoKeywords);

    const templateFields = CATEGORY_TEMPLATES[p.category] || [];
    const templated: Record<string, string> = {};
    const customs: { key: string; value: string }[] = [];

    Object.entries(p.specifications || {}).forEach(([key, val]) => {
      if (templateFields.some(f => f.key === key)) {
        templated[key] = val;
      } else {
        customs.push({ key, value: val });
      }
    });

    setTemplatedSpecs(templated);
    setCustomSpecs(customs);
    setVariantsList(p.variants.map(v => ({ name: v.name, sku: v.sku, barcode: v.barcode })));
    setShowAddForm(true);
    setShowBulkUpload(false);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    const templateFields = CATEGORY_TEMPLATES[cat] || [];
    const blankSpecs: Record<string, string> = {};
    templateFields.forEach(f => {
      blankSpecs[f.key] = '';
    });
    setTemplatedSpecs(blankSpecs);
  };

  const resetForm = () => {
    setEditingProdId(null);
    setName('');
    setBrand('');
    setCategory('Grocery');
    setSubCategory('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600');
    setSeoKeywords('');
    setTemplatedSpecs({});
    setCustomSpecs([]);
    setVariantsList([{ name: 'Standard lot', sku: `RDX-GCR-${Math.floor(100 + Math.random() * 900)}`, barcode: '8900000001' }]);
  };

  const addCustomAttr = () => {
    if (!newCustomKey.trim()) return;
    setCustomSpecs([...customSpecs, { key: newCustomKey.trim(), value: newCustomVal.trim() }]);
    setNewCustomKey('');
    setNewCustomVal('');
  };

  const removeCustomAttr = (idx: number) => {
    setCustomSpecs(customSpecs.filter((_, i) => i !== idx));
  };

  const addVariantRow = () => {
    setVariantsList([...variantsList, { 
      name: '', 
      sku: `RDX-VAR-${variantsList.length + 1}-${Math.floor(10 + Math.random() * 90)}`, 
      barcode: `${8900000000 + variantsList.length + Math.floor(Math.random()*100)}` 
    }]);
  };

  const updateVariantRow = (idx: number, field: 'name' | 'sku' | 'barcode', value: string) => {
    const updated = [...variantsList];
    updated[idx] = { ...updated[idx], [field]: value };
    setVariantsList(updated);
  };

  const deleteVariantRow = (idx: number) => {
    setVariantsList(variantsList.filter((_, i) => i !== idx));
  };

  const handleBulkUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setSuccessMsg('');

    try {
      const parsed = JSON.parse(bulkJson);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      for (const item of items) {
        if (!item.name || !item.brand || !item.category) {
          throw new Error(`Item missing Core keys. Name, brand and category are required.`);
        }
        if (!item.variants || !Array.isArray(item.variants) || item.variants.length === 0) {
          throw new Error(`Every bulk product must contain non-empty variants array.`);
        }
      }

      for (const item of items) {
        const payload = {
          id: item.id || `prod-${Math.floor(100 + Math.random() * 900)}`,
          name: item.name,
          brand: item.brand,
          category: item.category,
          subCategory: item.subCategory || "General",
          description: item.description || "Rudrax dynamic processed item specifier catalog.",
          image: item.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
          seoKeywords: item.seoKeywords || "rudrax item, general stash",
          specifications: item.specifications || { "Origin": "Verified Hub" },
          variants: item.variants.map((v: any) => ({
            id: v.id || `v-${Math.floor(1000 + Math.random() * 9000)}`,
            name: v.name || "Default",
            sku: v.sku || `RDX-BULK-${Math.floor(1000 + Math.random() * 9000)}`,
            barcode: v.barcode || String(Math.floor(89010000 + Math.random()*90000))
          }))
        };
        await createProduct(payload);
      }

      setSuccessMsg(`Successfully parsed and synchronized ${items.length} dynamic items to Firestore catalog!`);
      setShowBulkUpload(false);
    } catch (ex: any) {
      setErr(`JSON Parsing Error: ${ex.message || String(ex)}`);
    }
  };

  return (
    <div className="admin-products flex flex-col gap-6 select-none font-sans p-4">
      
      {/* Banner / Notices */}
      {(err || successMsg) && (
        <div className="flex flex-col gap-1 rounded-2xl animate-fadeIn transition-all shadow-sm">
          {err && (
            <div className="bg-rose-50 border border-rose-200 text-rose-905 rounded-xl px-4 py-3 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-605 flex-shrink-0" />
              <span>{err}</span>
            </div>
          )}
          {successMsg && (
            <div className="bg-teal-50 border border-teal-200 text-teal-905 rounded-xl px-4 py-3 text-xs font-semibold flex items-center gap-2">
              <CheckCircle size={16} className="text-teal-605 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Page Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
            <Layers className="text-teal-605" size={26} /> 
            Rudrax Master Catalog Engine
          </h1>
          <p className="text-xs text-slate-500 font-bold tracking-wide mt-2 uppercase font-mono">
            Category Template Engine • Dynamic Attribute Registry • Bulk Seeder
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { setShowBulkUpload(!showBulkUpload); setShowAddForm(false); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              showBulkUpload 
                ? 'bg-amber-50 text-amber-805 border-amber-200' 
                : 'bg-white hover:bg-slate-50 text-slate-705 border-slate-200 shadow-xs'
            }`}
          >
            <Upload size={14} /> Bulk JSON Upload
          </button>
          <button
            onClick={() => { resetForm(); setShowAddForm(!showAddForm); setShowBulkUpload(false); }}
            className={`px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
              showAddForm ? 'ring-2 ring-teal-500' : ''
            }`}
          >
            <Plus size={15} /> Publish New Product
          </button>
        </div>
      </div>

      {/* Bulk JSON Seeder Control Center */}
      {showBulkUpload && (
        <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-xl max-w-5xl animate-fadeIn flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-black text-amber-400 flex items-center gap-1.5">
                <FileJson size={16} /> Bulk Upload Schema Engine
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Define, validate and synchronize batch products directly to Firestore ledger</p>
            </div>
            <span className="text-[9px] font-bold font-mono bg-slate-850 px-2.5 py-1 rounded text-slate-300">RMAD-03 CERTIFIED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            {/* Presets Column */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Preset Seed Materials</span>
              {BULK_PRESETS.map((bp) => (
                <button
                  key={bp.title}
                  type="button"
                  onClick={() => setBulkJson(JSON.stringify(bp.data, null, 2))}
                  className="w-full text-left p-2.5 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-all flex items-center justify-between"
                >
                  <span>{bp.title}</span>
                  <Badge variant="success">{bp.category}</Badge>
                </button>
              ))}
              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800/80 text-[10px] text-slate-400 leading-relaxed font-semibold">
                <Info size={13} className="inline mr-1 text-amber-400" />
                Preserve SKU rules from RMAD when crafting custom catalog payloads.
              </div>
            </div>

            {/* Editing Box Column */}
            <form onSubmit={handleBulkUploadSubmit} className="md:col-span-3 flex flex-col gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Structured JSON Cargo</span>
              <textarea
                value={bulkJson}
                onChange={(e) => setBulkJson(e.target.value)}
                rows={10}
                className="w-full bg-slate-950 font-mono text-xs text-amber-300 p-4 border border-slate-800 rounded-2xl focus:outline-none focus:border-amber-500 shadow-inner"
                placeholder="Paste products JSON array here..."
              />
              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowBulkUpload(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-slate-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/10"
                >
                  <Check size={14} /> Synchronize to Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Form - Category Template Engine & Attribute Engine */}
      {showAddForm && (
        <form onSubmit={handleCreateProduct} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm max-w-5xl flex flex-col gap-5 animate-fadeIn">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h2 className="text-sm font-black text-teal-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={16} />
              {editingProdId ? 'Modify Product Specifications' : 'Publish Brand New Product Item'}
            </h2>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold font-mono"
            >
              ESC FORM
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Product Name" placeholder="e.g. Celestial Pedestal Fan" value={name} onChange={setName} />
            <Input label="Brand / Manufacturer" placeholder="e.g. Havells" value={brand} onChange={setBrand} />
            
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-bold text-slate-700">Business Category Sectors</label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:border-teal-505 font-semibold font-sans shadow-xs"
              >
                {allCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Subcategory Window" placeholder="e.g. Smart Cooling" value={subCategory} onChange={setSubCategory} />
            <Input label="Visual Image URL" placeholder="https://images.unsplash..." value={image} onChange={setImage} />
            <Input label="SEO Meta Keywords" placeholder="cooling fan, white fan, electronic" value={seoKeywords} onChange={setSeoKeywords} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 font-sans">Comprehensive Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain materials, pure ingredients, safety guidelines, and user value propositions clearly."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:border-teal-505 font-medium shadow-xs"
            />
          </div>

          {/* DYNAMIC CATEGORY TEMPLATE SPECIFICATION ENGINE */}
          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-3">
            <h3 className="text-xs font-black uppercase text-teal-800 tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200/40">
              <Layers size={14} /> Category Template Engine - Pre-allocated Properties
            </h3>
            
            {(CATEGORY_TEMPLATES[category] || []).length === 0 ? (
              <p className="text-xs text-slate-500 font-semibold italic">No fixed template properties for this sector. Sourced freely.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(CATEGORY_TEMPLATES[category] || []).map((field) => (
                  <div key={field.key} className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">{field.label}</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-teal-400 font-semibold shadow-xs"
                      placeholder={field.placeholder}
                      value={templatedSpecs[field.key] || ''}
                      onChange={(e) => setTemplatedSpecs({ ...templatedSpecs, [field.key]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ATTRIBUTE ENGINE SPECIFICATIONS */}
          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase text-slate-600 tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200/40">
              <Plus size={14} /> Dynamic Attribute Engine (Custom Key-Value Attributes)
            </h3>

            {/* Built list of custom attributes */}
            {customSpecs.length > 0 && (
              <div className="flex flex-wrap gap-2.5">
                {customSpecs.map((spec, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 pl-3 pr-1.5 py-1.5 rounded-xl flex items-center gap-2 text-xs shadow-xs">
                    <span className="font-extrabold text-slate-500 font-mono text-[10px] uppercase">{spec.key}:</span>
                    <span className="text-slate-800 font-semibold">{spec.value}</span>
                    <button
                      type="button"
                      onClick={() => removeCustomAttr(idx)}
                      className="text-rose-600 hover:bg-rose-50 p-1 rounded-md transition-colors font-bold font-mono text-[10px] cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <Input label="Specification Title Attribute" placeholder="e.g. Material, Color, Weight" value={newCustomKey} onChange={setNewCustomKey} />
              <Input label="Specification Value Attribute" placeholder="e.g. Red, XL, Pure Cotton" value={newCustomVal} onChange={setNewCustomVal} />
              <button
                type="button"
                onClick={addCustomAttr}
                className="h-9 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center cursor-pointer mb-1.5"
              >
                + Register Attribute
              </button>
            </div>
          </div>

          {/* VARIANTS AND DEEP SKUs */}
          <div className="border border-slate-200/60 p-5 rounded-3xl flex flex-col gap-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Retail Pack Variants & Barcodes</h3>
              <button
                type="button"
                onClick={addVariantRow}
                className="text-[10px] font-black tracking-wide text-teal-600 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-lg hover:bg-teal-101 transition-all cursor-pointer"
              >
                + Add Custom Variant Pack
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {variantsList.map((vr, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end bg-slate-50 hover:bg-slate-50/70 p-4 rounded-2xl border border-slate-150 transition-colors">
                  <Input label="Variant Retail Pack Description" placeholder="e.g. 5kg Sack, White 1200mm" value={vr.name} onChange={v => updateVariantRow(idx, 'name', v)} />
                  <Input label="Product SKU (Company unique)" placeholder="e.g. RDX-FAN-WHT-1200" value={vr.sku} onChange={v => updateVariantRow(idx, 'sku', v)} />
                  <div className="flex gap-2 items-center w-full">
                    <Input label="Universal Barcode upc" placeholder="89011122" value={vr.barcode} onChange={v => updateVariantRow(idx, 'barcode', v)} />
                    {variantsList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteVariantRow(idx)}
                        className="p-2 text-rose-600 hover:bg-rose-105 rounded-lg border border-rose-200 mt-6 cursor-pointer mb-1.5 flex-shrink-0"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2.5 justify-end pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>Discard</Button>
            <Button variant="primary" size="sm" type="submit">
              {editingProdId ? 'Save Specs Updates' : 'Publish to Catalog'}
            </Button>
          </div>
        </form>
      )}

      {/* FILTER GATEWAY & LEDGER LIST */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col gap-5 select-none md:p-6">
        
        {/* Dynamic Multi-faceted Search Engine & Filters */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <span className="text-xs font-black text-slate-700 flex items-center gap-1.5 font-sans">
              <Search size={14} className="text-teal-605" /> Catalog Filter & Search Engine
            </span>
            <button
              onClick={() => {
                setSearchFilter('');
                setCategoryFilter('All');
                setBrandFilter('All');
                setStockStatusFilter('All');
              }}
              className="text-[10px] font-bold text-teal-600 hover:text-teal-800 font-mono uppercase cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search Item, Brand, keywords or SKU..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:border-teal-500 font-semibold shadow-xs font-sans"
              />
            </div>

            {/* Category selection */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:border-teal-500 font-semibold font-sans shadow-xs cursor-pointer"
            >
              <option value="All">All Categories ({products.length})</option>
              {allCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Brand Selection */}
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:border-teal-500 font-semibold font-sans shadow-xs cursor-pointer"
            >
              <option value="All">All Brands</option>
              {uniqueBrands.slice(1).map(br => (
                <option key={br} value={br}>{br}</option>
              ))}
            </select>

            {/* Stock status filter */}
            <select
              value={stockStatusFilter}
              onChange={(e) => setStockStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:border-teal-500 font-semibold font-sans shadow-xs cursor-pointer"
            >
              <option value="All">All Stock Levels</option>
              <option value="Healthy">Healthy Stock (&gt;5)</option>
              <option value="Low">Low Stock (1-5)</option>
              <option value="Out">Out Of Stock (0)</option>
            </select>
          </div>
        </div>

        {/* Catalog Table */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="text-xs text-slate-500 font-extrabold font-mono uppercase tracking-wider">
            Active Catalog Grid ({filteredProductsList.length} items matched)
          </span>
          <span className="text-[10px] font-bold text-slate-400 font-mono">
            COURIABLE ENVELOPE SECTOR
          </span>
        </div>

        {filteredProductsList.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-3xl flex flex-col items-center">
            <AlertTriangle className="text-amber-500 mb-2" size={32} />
            <h4 className="text-sm font-bold text-slate-850">Empty Query Stream</h4>
            <p className="text-xs text-slate-450 mt-1 max-w-xs">No catalog products match current search criteria. Try removing active filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProductsList.map((p) => {
              const totalAggStock = p.variants.reduce((total, vr) => {
                const vBatches = batches.filter(b => b.productId === p.id && b.variantId === vr.id);
                return total + vBatches.reduce((sum, b) => sum + b.quantity, 0);
              }, 0);

              return (
                <div key={p.id} className="border border-slate-200/80 rounded-2xl p-4 bg-white hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between relative group shadow-xs">
                  
                  {/* Visual Header */}
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant="success">{p.category}</Badge>
                        <span className="text-[9px] font-bold font-mono bg-slate-100 border border-slate-200 text-slate-600 rounded px-1.5 py-0.5">{p.brand}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-teal-700 transition-colors mt-1.5 line-clamp-1">
                        {p.name}
                      </h4>
                      <p className="text-[10px] text-slate-450 line-clamp-1 font-semibold">{p.subCategory}</p>
                    </div>

                    <div className="h-10 w-10 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0 flex items-center justify-center">
                      <img src={p.image} referrerPolicy="no-referrer" className="h-full w-full object-cover" alt={p.name} />
                    </div>
                  </div>

                  {/* Specifications Snapshot */}
                  {p.specifications && Object.keys(p.specifications).length > 0 && (
                     <div className="bg-slate-50 border border-slate-150/40 p-2.5 rounded-xl text-[10px] font-semibold text-slate-600 flex flex-col gap-1 mb-3.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono block mb-1">Specs Sheet</span>
                      {Object.entries(p.specifications).slice(0, 3).map(([k, v]) => (
                        <div key={k} className="flex justify-between items-baseline gap-2">
                          <span className="text-slate-455 uppercase text-[9px] font-mono whitespace-nowrap">{k}:</span>
                          <span className="text-slate-800 text-right truncate font-bold">{v}</span>
                        </div>
                      ))}
                      {Object.keys(p.specifications).length > 3 && (
                        <span className="text-slate-400 text-[8px] italic flex items-center justify-end mt-0.5">+ {Object.keys(p.specifications).length - 3} more specs</span>
                      )}
                    </div>
                  )}

                  {/* Pack variants list */}
                  <div className="flex flex-col gap-1.5 pt-3 border-t border-slate-100">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">Retail Variants</span>
                    <div className="flex flex-col gap-1 font-mono">
                      {p.variants.map((v) => {
                        const vBatches = batches.filter(b => b.productId === p.id && b.variantId === v.id);
                        const vStock = vBatches.reduce((s, b) => s + b.quantity, 0);
                        return (
                          <div key={v.id} className="flex justify-between items-center text-[10px] font-mono bg-slate-50 border border-slate-150/50 p-1 px-2 rounded-lg text-slate-600">
                            <span className="truncate max-w-[110px] font-semibold">{v.name}</span>
                            <div className="flex items-center gap-1.5 font-bold">
                              <span className="text-[9px] text-slate-400">{v.sku}</span>
                              <span className={`px-1 py-0.5 rounded ${vStock === 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                {vStock} Left
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-black font-mono tracking-tight flex items-center gap-1">
                      {totalAggStock === 0 ? (
                        <span className="text-rose-600 bg-rose-50 px-2 py-1 rounded-sm">OUT OF STOCK</span>
                      ) : totalAggStock <= 5 ? (
                        <span className="text-pink-600 bg-pink-50 px-2 py-1 rounded-sm flex items-center gap-1">
                          <AlertTriangle size={11} /> LOW STOCK ({totalAggStock})
                        </span>
                      ) : (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded-sm">HEALTHY ({totalAggStock})</span>
                      )}
                    </span>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleEditTrigger(p)}
                        className="p-1 px-2 text-teal-600 hover:bg-teal-50 border border-teal-200 hover:border-teal-300 rounded-lg transition-all cursor-pointer text-xs font-bold font-mono flex items-center gap-1 justify-center"
                      >
                        <Edit2 size={12} /> Edit Specs
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1 text-rose-600 hover:bg-rose-50 border border-rose-200 hover:border-rose-305 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                        title="Delete Asset"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
export { AdminProducts as default };
