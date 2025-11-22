// src/features/dashboard/components/receipt/ReceiptDetail.jsx
import { useState } from 'react';
import Button from '../../../../components/ui/Button';
import Card from '../../../../components/ui/Card';
import Modal from '../../../../components/ui/Modal';
import { useThemeMode } from '../../../../context/ThemeContext';

const sampleProducts = [
  { code: 'DESK001', name: 'Desk', qty: 6, inStock: true },
];

const ReceiptDetail = ({ receipt, onBack, currentUser }) => {
  const [products, setProducts] = useState(sampleProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ code: '', name: '', qty: '' });
  const { mode } = useThemeMode();

  const screenTextColor = mode === 'dark' ? 'text-white' : 'text-black';
  const handlePrint = () => window.print();

  const handleAddProduct = () => {
    if (newProduct.code && newProduct.name && newProduct.qty) {
      setProducts([...products, { ...newProduct, qty: parseInt(newProduct.qty, 10), inStock: true }]);
      setNewProduct({ code: '', name: '', qty: '' });
      setModalOpen(false);
    }
  };

  return (
    <div className={`space-y-6 max-w-5xl mx-auto p-6 ${mode === 'dark' ? 'bg-black' : 'bg-white'} ${screenTextColor}`}>
      <style>{`
        @media print {
          body { background: #fff !important; color: #000 !important; }
          table, th, td { color: #000 !important; }
          select, button { display: none; }
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <Button variant="ghost" onClick={onBack} className={screenTextColor}>
          <ion-icon name="arrow-back-outline" class="mr-2"></ion-icon>
          Back
        </Button>
      </div>

      <h1 className="text-4xl font-extrabold text-center mb-4">{mode === 'dark' ? <span className="text-white">RECEIPT</span> : <span className="text-black">RECEIPT</span>}</h1>

      {/* Actions */}
      <div className="flex gap-3 justify-center mb-6 print:hidden">
        <Button className="bg-green-500 hover:bg-green-600 text-black font-bold">Validate</Button>
        <Button onClick={handlePrint} className="bg-gray-800 hover:bg-gray-900 text-white font-bold">Print</Button>
        <Button className="bg-red-500 hover:bg-red-600 text-black font-bold">Cancel</Button>
      </div>

      {/* Receipt Info */}
      <Card className={`p-6 shadow-lg rounded-lg border border-white ${mode === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-semibold">Reference:</label>
            <div className="mt-1 dark:text-blue-50 text-blue-950">{receipt.reference}</div>
          </div>
          <div>
            <label className="font-semibold">Receive From:</label>
            <div className="mt-1 dark:text-blue-50 text-blue-950">{receipt.from}</div>
          </div>
          <div>
            <label className="font-semibold">Schedule Date:</label>
            <div className="mt-1 dark:text-blue-50 text-blue-950">{receipt.scheduleDate}</div>
          </div>
          <div>
            <label className="font-semibold">Responsible:</label>
            <div className="mt-1 dark:text-blue-50 text-blue-950">{currentUser || 'Operator'}</div>
          </div>
        </div>
      </Card>

      {/* Products */}
      <Card className={`p-6 shadow-lg rounded-lg border border-white ${mode === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Products</h2>
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-white dark:bg-gray-700 text-black dark:text-white font-bold print:hidden"
          >
            Add Product
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white dark:bg-gray-700 text-black dark:text-white print:text-black">
              <tr>
                <th className="border px-3 py-2">Code</th>
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => (
                <tr key={idx} className={!p.inStock ? 'bg-red-100 dark:bg-red-900 print:bg-white' : ''}>
                  <td className="border px-3 py-2 dark:text-white">{p.code}</td>
                  <td className="border px-3 py-2 dark:text-white">{p.name}</td>
                  <td className="border px-3 py-2 dark:text-white">{p.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Product Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Product">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Product Code"
            className="border-none rounded-full px-3 py-2 w-full dark:bg-gray-500 dark:text-white focus:outline-blue-950"
            value={newProduct.code}
            onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
          />
          <input
            type="text"
            placeholder="Product Name"
            className="border-none rounded-full px-3 py-2 w-full dark:bg-gray-500 dark:text-white focus:outline-blue-950"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantity"
            className="border-none rounded-full px-3 py-2 w-full dark:bg-gray-500 dark:text-white focus:outline-blue-950"
            value={newProduct.qty}
            onChange={(e) => setNewProduct({ ...newProduct, qty: e.target.value })}
          />

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddProduct}>Add</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReceiptDetail;
