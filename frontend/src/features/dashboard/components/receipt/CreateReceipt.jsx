import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../../../components/ui/Button';
import axios from 'axios';

// --- NEW CONSTANT: Base URL updated to port 3000 ---

// --- Mock Data (No change) ---
const mockLocations = [
    { id: '1', name: 'Location A1', shortCode: 'LOC1', warehouseId: '1' },
    { id: '2', name: 'Location B1', shortCode: 'LOC2', warehouseId: '1' },
    { id: '3', name: 'Location C1', shortCode: 'LOC3', warehouseId: '2' },
];

// --- Modal Component (No change) ---
const SummaryModal = ({ formData, onConfirm, onCancel, isSubmitting }) => {
    // Calculate total quantity for the summary
    const totalProducts = formData.products.reduce((sum, p) => sum + p.quantity, 0);

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-xl leading-6 font-bold text-gray-900 dark:text-white mb-4" id="modal-title">
                            Review Receipt Details
                        </h3>
                        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                            <h4 className="font-semibold text-base text-blue-600 dark:text-blue-400 border-b pb-1">Basic Information</h4>
                            <div><span className="font-semibold w-24 inline-block">Operation:</span> {formData.operationType}</div>
                            <div><span className="font-semibold w-24 inline-block">Reference:</span> {formData.reference || '-'}</div>
                            <div><span className="font-semibold w-24 inline-block">From:</span> {formData.from || '-'}</div>
                            <div><span className="font-semibold w-24 inline-block">To:</span> {formData.to || '-'}</div>
                            <div><span className="font-semibold w-24 inline-block">Contact:</span> {formData.contact || '-'}</div>
                            <div><span className="font-semibold w-24 inline-block">Schedule:</span> {formData.schedule ? new Date(formData.schedule).toLocaleString() : '-'}</div>
                            <div className={`mt-2 py-1 px-2 rounded font-semibold ${formData.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}><span className="w-24 inline-block">Status:</span> {formData.status}</div>

                            <h4 className="font-semibold text-base text-green-600 dark:text-green-400 border-b pt-3 pb-1">Products ({formData.products.length} Items, {totalProducts} Total Qty)</h4>
                            <ul className="max-h-40 overflow-y-auto space-y-2">
                                {formData.products.map((p, index) => (
                                    <li key={index} className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs">
                                        <span className="font-medium text-gray-900 dark:text-white">{p.productName}</span> ({p.productSku}) - **Qty: {p.quantity}**
                                    </li>
                                ))}
                                {formData.products.length === 0 && <li className="text-center text-gray-500">No products added.</li>}
                            </ul>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <Button
                            type="button"
                            onClick={onConfirm}
                            variant="contained"
                            disabled={isSubmitting}
                            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'} focus:outline-none sm:ml-3 sm:w-auto sm:text-sm`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <ion-icon name="save-outline" class="mr-2"></ion-icon> Confirm and Save
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            variant="outlined"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---
const CreateReceipt = ({ onBack, onSave }) => {
    const [warehouseShortCodes, setWarehouseShortCodes] = useState([]);
    const [productsList, setProductsList] = useState([]);
    const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(false);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [warehouseError, setWarehouseError] = useState(null);
    const [productError, setProductError] = useState(null);

    // State for submission
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);


    const [formData, setFormData] = useState(() => ({
        operationType: 'Receipt',
        reference: '',
        warehouseShortCode: '',
        from: '',
        to: '',
        contact: '',
        schedule: new Date().toISOString().split('T')[0] + 'T' + new Date().toTimeString().split(' ')[0].substring(0, 5),
        status: 'draft',
        products: [],
    }));

    const [referenceCounter, setReferenceCounter] = useState(1);
    const [currentProduct, setCurrentProduct] = useState({
        productId: '',
        quantity: '',
    });
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);

    // Build reference like: WH1/IN/0001 and auto-increment the numeric part
    const buildReferenceFromShortCode = useCallback((shortCode) => {
        const num = String(referenceCounter).padStart(4, '0');
        return `${shortCode}/IN/${num}`;
    }, [referenceCounter]);

    const fetchWarehouseShortCodes = async () => {
        setIsLoadingWarehouses(true);
        setWarehouseError(null);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/warehouse/short-codes`);
            setWarehouseShortCodes(response.data);
        } catch (error) {
            console.error('Error fetching warehouse short codes:', error);
            setWarehouseError('Failed to load warehouses. Please try again.');
        } finally {
            setIsLoadingWarehouses(false);
        }
    };

    const fetchProducts = async () => {
        setIsLoadingProducts(true);
        setProductError(null);
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/products`);
            setProductsList(response.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProductError('Failed to load products. Please try again.');
        } finally {
            setIsLoadingProducts(false);
        }
    };

    useEffect(() => {
        fetchWarehouseShortCodes();
        fetchProducts();

        if (formData.warehouseShortCode && !formData.reference) {
            setFormData(prev => ({
                ...prev,
                reference: buildReferenceFromShortCode(prev.warehouseShortCode)
            }));
        }
    }, [formData.warehouseShortCode, formData.reference, buildReferenceFromShortCode]);


    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
        // Clear global success/error on any change
        setSubmitSuccess(false);
        setSubmitError(null);
    };

    const handleWarehouseChange = (shortCode) => {
        const newReference = shortCode ? buildReferenceFromShortCode(shortCode) : '';
        setFormData(prev => ({
            ...prev,
            warehouseShortCode: shortCode,
            reference: newReference
        }));
        if (shortCode) {
            setReferenceCounter(prev => prev + 1);
        }
        if (errors.reference) {
            setErrors(prev => ({ ...prev, reference: '' }));
        }
    }


    const handleAddProduct = () => {
        if (!currentProduct.productId || !currentProduct.quantity || currentProduct.quantity <= 0) {
            setErrors(prev => ({
                ...prev,
                product: 'Please select a product and enter a valid quantity (min 1)'
            }));
            return;
        }

        const product = productsList.find(p => p.id === currentProduct.productId);

        if (!product) {
            setErrors(prev => ({ ...prev, product: 'Selected product not found.' }));
            return;
        }

        const newProduct = {
            productId: currentProduct.productId,
            productName: product.name,
            productSku: product.sku,
            quantity: parseInt(currentProduct.quantity),
        };

        setFormData(prev => ({
            ...prev,
            products: [...prev.products, newProduct]
        }));

        setCurrentProduct({ productId: '', quantity: '' });
        setErrors(prev => ({ ...prev, product: '' }));
    };

    const handleRemoveProduct = (index) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.reference.trim()) newErrors.reference = 'A warehouse must be selected to generate a reference.';
        if (!formData.from.trim()) newErrors.from = 'Source (From) field is required';
        if (!formData.to.trim()) newErrors.to = 'Destination (To) field is required';
        if (!formData.contact.trim()) newErrors.contact = 'Contact is required';
        if (!formData.schedule) newErrors.schedule = 'Schedule date and time is required';
        if (formData.products.length === 0) newErrors.products = 'At least one product is required for the receipt';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Triggered when user clicks "Review & Create"
    const handlePreSubmit = (e) => {
        e.preventDefault();
        setSubmitSuccess(false);
        setSubmitError(null);

        if (validateForm()) {
            setShowModal(true);
        }
    };

    // --- API Submission Logic ---
    const handleCreateReceipt = async () => {
        setShowModal(false);
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        // Prepare data in the exact format required by the controller
        const submissionData = {
            operationType: formData.operationType,
            reference: formData.reference,
            from: formData.from,
            to: formData.to,
            contact: formData.contact,
            // Convert to ISO string for backend
            schedule: new Date(formData.schedule).toISOString(),
            status: formData.status,
            // Map to [{ productId, quantity }]
            products: formData.products.map(p => ({
                productId: p.productId,
                quantity: p.quantity
            }))
        };

        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/receipts/create`, submissionData);
            console.log('Receipt created successfully:', response.data);
            setSubmitSuccess(true);

            // Call onSave to trigger parent actions (e.g., redirect)
            if (onSave) {
                onSave(response.data);
            }
        } catch (error) {
            console.error('Error creating receipt:', error);
            const errorMessage = error.response?.data?.message || error.message;
            setSubmitError(`Failed to create receipt: ${errorMessage}. Please check the console for details.`);
        } finally {
            setIsSubmitting(false);
        }
    };
    // --- End API Submission Logic ---


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
            <div className="w-full px-6 lg:px-12">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" onClick={onBack} className="group hover:bg-gray-100 dark:hover:bg-gray-700">
                                <ion-icon name="arrow-back-outline" class="mr-2"></ion-icon>
                                Back
                            </Button>
                            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                                Create New Receipt
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Global Feedback */}
                {submitSuccess && (
                    <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-200 rounded-lg" role="alert">
                        <span className="font-medium">Success!</span> Receipt has been created and saved.
                    </div>
                )}
                {submitError && (
                    <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded-lg" role="alert">
                        <span className="font-medium">Error:</span> {submitError}
                    </div>
                )}


                {/* Form Sections (One below the other) */}
                <form onSubmit={handlePreSubmit} className="space-y-6">

                    {/* Basic Information Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <ion-icon name="document-text-outline" class="mr-2 text-blue-600"></ion-icon>
                            Basic Information
                        </h2>

                        <div className="space-y-4">
                            {/* Operation Type (Read-only as per initial state) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Operation Type</label>
                                <input
                                    type="text"
                                    value={formData.operationType}
                                    readOnly
                                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 cursor-not-allowed"
                                />
                            </div>

                            {/* Warehouse Shortcode -> Reference */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Warehouse Shortcode *
                                </label>
                                <select
                                    value={formData.warehouseShortCode}
                                    onChange={(e) => handleWarehouseChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    disabled={isLoadingWarehouses || warehouseError || isSubmitting}
                                >
                                    <option value="">
                                        {isLoadingWarehouses ? 'Loading warehouses...' : 'Select warehouse'}
                                    </option>
                                    {warehouseShortCodes.map(w => (
                                        <option key={w.id} value={w.shortCode}>{w.name} ({w.shortCode})</option>
                                    ))}
                                </select>
                                {warehouseError && (
                                    <p className="mt-1 text-sm text-red-600">{warehouseError} <Button variant="link" onClick={fetchWarehouseShortCodes} className="text-blue-500">Retry</Button></p>
                                )}
                            </div>

                            {/* Reference (auto) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reference (auto-generated)</label>
                                <input
                                    type="text"
                                    value={formData.reference}
                                    readOnly
                                    className={`w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white cursor-not-allowed ${errors.reference ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                />
                                {errors.reference && (
                                    <p className="mt-1 text-sm text-red-600">{errors.reference}</p>
                                )}
                            </div>

                            {/* From (input with suggestions) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">From *</label>
                                <input
                                    list="from-suggestions"
                                    type="text"
                                    value={formData.from}
                                    onChange={(e) => handleInputChange('from', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${errors.from ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                    placeholder="Type or select supplier/location"
                                    disabled={isSubmitting}
                                />
                                <datalist id="from-suggestions">
                                    {warehouseShortCodes.map(w => (<option key={`f-${w.id}`} value={`${w.name} (${w.shortCode})`} />))}
                                    {mockLocations.map(l => (<option key={`f-${l.id}`} value={`${l.name} (${l.shortCode})`} />))}
                                </datalist>
                                {errors.from && (<p className="mt-1 text-sm text-red-600">{errors.from}</p>)}
                            </div>

                            {/* To (input with suggestions) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">To *</label>
                                <input
                                    list="to-suggestions"
                                    type="text"
                                    value={formData.to}
                                    onChange={(e) => handleInputChange('to', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${errors.to ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                    placeholder="Type or select receiving location"
                                    disabled={isSubmitting}
                                />
                                <datalist id="to-suggestions">
                                    {warehouseShortCodes.map(w => (<option key={`t-${w.id}`} value={`${w.name} (${w.shortCode})`} />))}
                                    {mockLocations.map(l => (<option key={`t-${l.id}`} value={`${l.name} (${l.shortCode})`} />))}
                                </datalist>
                                {errors.to && (<p className="mt-1 text-sm text-red-600">{errors.to}</p>)}
                            </div>

                            {/* Contact */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact *</label>
                                <input
                                    type="text"
                                    value={formData.contact}
                                    onChange={(e) => handleInputChange('contact', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${errors.contact ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                    placeholder="Contact person or company"
                                    disabled={isSubmitting}
                                />
                                {errors.contact && (<p className="mt-1 text-sm text-red-600">{errors.contact}</p>)}
                            </div>

                            {/* Schedule */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Schedule Date & Time *</label>
                                <input
                                    type="datetime-local"
                                    value={formData.schedule}
                                    onChange={(e) => handleInputChange('schedule', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${errors.schedule ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                    disabled={isSubmitting}
                                />
                                {errors.schedule && (<p className="mt-1 text-sm text-red-600">{errors.schedule}</p>)}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    disabled={isSubmitting}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="ready">Ready</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Products Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <ion-icon name="cube-outline" class="mr-2 text-green-600"></ion-icon>
                            Products
                        </h2>

                        {errors.products && (
                            <p className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                {errors.products}
                            </p>
                        )}
                        {productError && (
                            <p className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                {productError} <Button variant="link" onClick={fetchProducts} className="text-blue-500">Retry</Button>
                            </p>
                        )}

                        {/* Add Product Form */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            {/* Product Select */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product</label>
                                <select
                                    value={currentProduct.productId}
                                    onChange={(e) => setCurrentProduct(prev => ({ ...prev, productId: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    disabled={isLoadingProducts || productError || isSubmitting}
                                >
                                    <option value="">
                                        {isLoadingProducts ? 'Loading products...' : 'Select product'}
                                    </option>
                                    {productsList.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} ({product.sku})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quantity Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
                                <input
                                    type="number"
                                    value={currentProduct.quantity}
                                    onChange={(e) => setCurrentProduct(prev => ({ ...prev, quantity: e.target.value }))}
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter quantity"
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Add Button */}
                            <div className="flex items-end col-span-2 md:col-span-1">
                                <Button
                                    type="button"
                                    onClick={handleAddProduct}
                                    variant="contained"
                                    className="bg-green-600 hover:bg-green-700 text-white w-full h-10"
                                    disabled={isSubmitting}
                                >
                                    <ion-icon name="add-circle-outline" class="mr-2"></ion-icon>
                                    Add Product
                                </Button>
                            </div>
                        </div>
                        {errors.product && (<p className="mb-4 text-sm text-red-600">{errors.product}</p>)}


                        {/* Products List */}
                        {formData.products.length > 0 ? (
                            <div className="overflow-hidden border border-gray-200 dark:border-gray-600 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">SKU</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                                        {formData.products.map((product, index) => (
                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{product.productName}</td>
                                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{product.productSku}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{product.quantity}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={() => handleRemoveProduct(index)}
                                                        className="text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        disabled={isSubmitting}
                                                    >
                                                        <ion-icon name="trash-outline"></ion-icon>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                <ion-icon name="cube-outline" class="text-4xl mb-2 opacity-50"></ion-icon>
                                <p>No products added yet</p>
                            </div>
                        )}
                    </div>

                    {/* Submit Button (Triggers Modal) */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg sm:static sm:p-0 sm:border-0 sm:shadow-none sm:pb-6">
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            className={`bg-blue-600 hover:bg-blue-700 text-white w-full h-12 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <ion-icon name="document-text-outline" class="mr-2"></ion-icon>
                                    Review & Create Receipt
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                {/* Summary Modal (Conditionally Rendered) */}
                {showModal && (
                    <SummaryModal
                        formData={formData}
                        onConfirm={handleCreateReceipt}
                        onCancel={() => setShowModal(false)}
                        isSubmitting={isSubmitting}
                    />
                )}
            </div>
        </div>
    );
};

export default CreateReceipt;