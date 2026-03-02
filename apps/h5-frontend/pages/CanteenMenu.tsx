
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { MOCK_DISHES, MOCK_CANTEENS } from '../constants';
import { ApiService } from '../api/service';

interface CartItem {
  id: string;
  name: string;
  price: number;
  count: number;
}

const CanteenMenu: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const canteen = MOCK_CANTEENS.find(c => c.id === id) || MOCK_CANTEENS[0];
  
  const [activeCategory, setActiveCategory] = useState('精品套餐');
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [isOrdering, setIsOrdering] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [balance, setBalance] = useState(ApiService.getBalance());

  useEffect(() => {
    const sync = () => setBalance(ApiService.getBalance());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const cartStats = useMemo(() => {
    const items = Object.values(cart) as CartItem[];
    const totalCount = items.reduce((sum, item) => sum + item.count, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.count), 0);
    return { totalCount, totalPrice, items };
  }, [cart]);

  const addToCart = (dish: any) => {
    setCart(prev => {
      const existing = prev[dish.id];
      return {
        ...prev,
        [dish.id]: { id: dish.id, name: dish.name, price: dish.price, count: (existing?.count || 0) + 1 }
      };
    });
  };

  const executePayment = async () => {
    if (isOrdering) return;
    setIsOrdering(true);
    setShowConfirm(false);
    
    const result = await ApiService.checkout(cartStats.totalPrice);
    
    setIsOrdering(false);
    if (result.success) {
      alert(`【支付成功】\n取餐号: ${result.data?.pickupCode}`);
      setCart({});
      navigate('/orders');
    } else {
      if (result.errorCode === 'E001') {
        if (window.confirm('账户余额不足，是否前往充值？')) {
          navigate('/wallet');
        }
      } else {
        alert(result.message || '支付异常，请重试');
      }
    }
  };

  const categories = useMemo(() => Array.from(new Set(MOCK_DISHES.map(d => d.category))), []);
  const filteredDishes = MOCK_DISHES.filter(d => d.category === activeCategory);

  return (
    <div className="min-h-screen bg-white flex flex-col page-transition relative overflow-hidden">
      <div className="bg-white px-4 h-14 flex items-center border-b border-slate-100 shrink-0 z-30">
        <button onClick={() => navigate('/canteen/select')}><ChevronLeft className="w-6 h-6 text-slate-400" /></button>
        <div className="flex-1 text-center pr-6">
          <h1 className="font-bold text-slate-800 leading-none">{canteen.name}</h1>
          <p className="text-[10px] text-slate-400 mt-1 font-bold">可用余额: ¥{balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-24 bg-slate-50 overflow-y-auto border-r border-slate-100">
          {categories.map(cat => (
            <button 
              key={cat} 
              data-testid={`category-${cat}`}
              onClick={() => setActiveCategory(cat)} 
              className={`w-full py-6 px-2 text-[11px] font-black text-center relative ${activeCategory === cat ? 'bg-white text-blue-600' : 'text-slate-400'}`}
            >
              {activeCategory === cat && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-600 rounded-r-full" />}
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
          {filteredDishes.map(dish => (
            <div key={dish.id} className="flex gap-3 bg-white p-2 rounded-3xl border border-transparent active:border-slate-100 transition-all">
              <div onClick={() => navigate(`/dish/${dish.id}`)} className="relative shrink-0 cursor-pointer">
                <img src={dish.imageUrl} className="w-24 h-24 rounded-2xl object-cover bg-slate-100 shadow-inner" alt={dish.name} />
                {cart[dish.id] && <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">{cart[dish.id].count}</div>}
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h4 className="font-bold text-slate-800 text-base">{dish.name}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{dish.description}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-blue-600 font-black text-lg">¥{dish.price.toFixed(1)}</span>
                  <button 
                    data-testid={`add-to-cart-${dish.id}`}
                    onClick={(e) => { e.stopPropagation(); addToCart(dish); }} 
                    className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-xl shadow-lg active:scale-90 transition-transform"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isOrdering && setShowConfirm(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-[3rem] p-8 animate-in zoom-in-95 duration-300 shadow-2xl">
            <h3 className="text-xl font-black text-slate-800 mb-6 text-center">确认结算</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">应付金额</span>
                <span className="text-blue-600 text-lg">¥{cartStats.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs">取消</button>
              <button 
                data-testid="btn-execute-payment"
                disabled={isOrdering} 
                onClick={executePayment} 
                className="flex-1 py-4 btn-primary rounded-2xl font-black text-xs flex items-center justify-center gap-2"
              >
                {isOrdering ? <Loader2 className="w-4 h-4 animate-spin" /> : '立即支付'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`fixed bottom-0 left-0 right-0 h-28 border-t border-slate-50 flex items-center px-6 bg-white/95 backdrop-blur-md z-50 transition-all duration-500 ${cartStats.totalCount > 0 ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <div className="flex-1">
          <p className="text-xl font-black text-slate-800 leading-none">¥{cartStats.totalPrice.toFixed(1)}</p>
          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">待支付菜品 × {cartStats.totalCount}</p>
        </div>
        <button 
          data-testid="btn-checkout"
          onClick={() => setShowConfirm(true)} 
          disabled={isOrdering} 
          className="bg-blue-600 text-white px-12 py-4 rounded-[1.8rem] font-black text-sm active:scale-95 transition-all shadow-xl shadow-blue-200"
        >
          去结算
        </button>
      </div>
    </div>
  );
};

export default CanteenMenu;
