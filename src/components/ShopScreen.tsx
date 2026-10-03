import React, { useState } from 'react';
import { UserProfile } from '../types';
import { sound } from '../utils/audio';

interface ShopScreenProps {
  currentUser: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onBack: () => void;
}

interface ShopItem {
  id: string;
  name: string;
  type: 'caping' | 'tool' | 'seed';
  icon: string;
  price: number;
  description: string;
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'caping_bambu',
    name: 'Caping Bambu Klasik',
    type: 'caping',
    icon: '🤠',
    price: 0,
    description: 'Topi caping anyaman bambu khas petani pedesaan yang sejuk dan ramah lingkungan.',
  },
  {
    id: 'caping_batik',
    name: 'Caping Motif Batik',
    type: 'caping',
    icon: '👒',
    price: 150,
    description: 'Caping berhias corak batik nusantara yang indah dan berwibawa.',
  },
  {
    id: 'caping_emas',
    name: 'Caping Emas Juara',
    type: 'caping',
    icon: '👑',
    price: 350,
    description: 'Diberikan untuk petani cilik berprestasi tinggi dengan panen berlimpah!',
  },
  {
    id: 'caping_pelangi',
    name: 'Caping Pelangi Ceria',
    type: 'caping',
    icon: '🎨',
    price: 500,
    description: 'Warna-warni ceria pembawa semangat bercocok tanam setiap pagi.',
  },
  {
    id: 'cangkul_baja',
    name: 'Cangkul Baja Tempa',
    type: 'tool',
    icon: '⛏️',
    price: 200,
    description: 'Alat olah tanah super kuat untuk memudahkan aerasi tanah liat.',
  },
  {
    id: 'gembor_emas',
    name: 'Gembor Siram Ajaib',
    type: 'tool',
    icon: '🚿',
    price: 250,
    description: 'Penyiram tanaman dengan butiran air halus yang menyejukkan akar.',
  },
];

export const ShopScreen: React.FC<ShopScreenProps> = ({
  currentUser,
  onUpdateUser,
  onBack,
}) => {
  const [purchasedIds, setPurchasedIds] = useState<string[]>([
    'caping_bambu',
    currentUser.capingStyle || 'caping_bambu',
  ]);
  const [equippedCaping, setEquippedCaping] = useState<string>(
    currentUser.capingStyle || 'caping_bambu'
  );

  const handleBuy = (item: ShopItem) => {
    if (currentUser.coins < item.price) {
      sound.playError();
      return;
    }

    sound.playCoinSound();
    const newCoins = currentUser.coins - item.price;
    const updatedPurchased = [...purchasedIds, item.id];
    setPurchasedIds(updatedPurchased);

    let updatedCaping = equippedCaping;
    if (item.type === 'caping') {
      updatedCaping = item.id;
      setEquippedCaping(item.id);
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      coins: newCoins,
      capingStyle: updatedCaping,
    };

    onUpdateUser(updatedUser);
  };

  const handleEquip = (item: ShopItem) => {
    sound.playClick();
    setEquippedCaping(item.id);
    const updatedUser: UserProfile = {
      ...currentUser,
      capingStyle: item.id,
    };
    onUpdateUser(updatedUser);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-white hover:bg-stone-50 px-4 py-2 rounded-2xl border border-stone-200 shadow-xs transition"
        >
          <span>← Kembali ke Peta</span>
        </button>

        <div className="flex items-center gap-2 bg-amber-100 border border-amber-300 px-4 py-1.5 rounded-full text-amber-900 font-fredoka font-black text-sm shadow-xs">
          <span>🪙 Koin Kamu:</span>
          <span>{currentUser.coins}</span>
        </div>
      </div>

      {/* Shop Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-300">
        <div className="text-center mb-6">
          <div className="inline-block p-3 rounded-2xl bg-amber-100 border border-amber-300 text-4xl mb-2">
            🤠
          </div>
          <h1 className="text-2xl font-black font-fredoka text-stone-900">
            Toko Caping & Alat Tani
          </h1>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Gunakan koin hasil panenmu untuk mempercantik avatar petanimu!
          </p>
        </div>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SHOP_ITEMS.map((item) => {
            const isOwned = purchasedIds.includes(item.id) || item.price === 0;
            const isEquipped = equippedCaping === item.id;
            const canAfford = currentUser.coins >= item.price;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-3xl border-2 flex items-start gap-4 transition ${
                  isEquipped
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200'
                    : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-4xl shadow-xs shrink-0">
                  {item.icon}
                </div>

                <div className="flex-1 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-stone-900">{item.name}</h3>
                      {item.price === 0 ? (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-stone-200 text-stone-600">
                          Bawaan
                        </span>
                      ) : (
                        <span className="text-xs font-black text-amber-700 font-fredoka flex items-center gap-1">
                          <span>🪙</span>
                          <span>{item.price}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-3">
                    {isEquipped ? (
                      <span className="inline-block px-3 py-1 bg-amber-500 text-white font-extrabold text-[11px] rounded-xl shadow-xs">
                        ✓ Sedang Dipakai
                      </span>
                    ) : isOwned ? (
                      <button
                        onClick={() => handleEquip(item)}
                        className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs rounded-xl transition"
                      >
                        Pakai Caping
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={!canAfford}
                        className={`px-4 py-1.5 font-extrabold text-xs rounded-xl shadow-xs transition ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-600 text-white active:scale-95'
                            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Beli Sekarang' : 'Koin Kurang'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
