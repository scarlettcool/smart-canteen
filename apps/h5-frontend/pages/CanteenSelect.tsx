
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Navigation, Clock } from 'lucide-react';
import { MOCK_CANTEENS } from '../constants';

const CanteenSelect: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 page-transition">
      <div className="bg-white px-4 h-14 flex items-center border-b border-slate-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)}><ChevronLeft className="w-6 h-6" /></button>
        <h1 className="flex-1 text-center font-bold text-slate-800 pr-6">选择食堂</h1>
      </div>

      <div className="p-4 space-y-4">
        {MOCK_CANTEENS.map((canteen) => (
          <div 
            key={canteen.id} 
            onClick={() => canteen.status === 'open' && navigate(`/canteen/${canteen.id}/menu`)}
            className={`bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all ${canteen.status === 'closed' ? 'opacity-60 grayscale' : 'cursor-pointer'}`}
          >
            <div className="flex gap-4 items-center">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${canteen.status === 'open' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                <Navigation className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-lg">{canteen.name}</h3>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {canteen.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {canteen.status === 'open' ? '正在营业' : '暂停服务'}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-blue-600">{canteen.distance}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CanteenSelect;
