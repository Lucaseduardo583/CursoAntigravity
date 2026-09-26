import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import Footer from './components/Footer';
import AllowedNeighborhoodsModal from './components/AllowedNeighborhoodsModal';

// Customer View Components
import PlanSelector from './components/CustomerView/PlanSelector';
import BasketCustomizer from './components/CustomerView/BasketCustomizer';
import DeliveryAddressForm from './components/CustomerView/DeliveryAddressForm';
import PaymentForm from './components/CustomerView/PaymentForm';
import SubscriptionSuccessModal from './components/CustomerView/SubscriptionSuccessModal';
import CustomerDeliveryTracker from './components/CustomerView/CustomerDeliveryTracker';

// Courier View Components
import CourierDashboard from './components/CourierView/CourierDashboard';

// Mock Data & Rules
import { 
  PLANS, 
  INITIAL_DELIVERIES, 
  validateZonaSulNeighborhood 
} from './data/mockData';

export default function App() {
  // Navigation State: 'customer' or 'courier'
  const [activeView, setActiveView] = useState('customer');

  // Business Rule 1: Sunday 23:59h Lock Simulation State
  const [isSundayLocked, setIsSundayLocked] = useState(false);

  // Selected Plan (Pequeno, Médio, Grande)
  const [selectedPlanId, setSelectedPlanId] = useState('medio');
  const currentPlan = PLANS.find(p => p.id === selectedPlanId) || PLANS[1];

  // Customized Items for the active plan
  const [customizedItems, setCustomizedItems] = useState(currentPlan.items);

  // Update items when plan changes
  const handleSelectPlan = (planId) => {
    setSelectedPlanId(planId);
    const newPlan = PLANS.find(p => p.id === planId);
    if (newPlan) {
      setCustomizedItems(newPlan.items);
    }
  };

  // Item swap logic (only allowed if not Sunday locked)
  const handleSwapItem = (targetItemId, replacementItem) => {
    if (isSundayLocked) return;
    setCustomizedItems(prev => 
      prev.map(item => item.id === targetItemId ? { ...replacementItem, id: targetItemId } : item)
    );
  };

  const handleResetItems = () => {
    if (isSundayLocked) return;
    setCustomizedItems(currentPlan.items);
  };

  // Customer Delivery Address Form State
  const [addressData, setAddressData] = useState({
    nome: 'Mariana Duarte Alencar',
    telefone: '(21) 98412-3341',
    bairro: 'Ipanema', // Default to valid Zona Sul
    rua: 'Rua Visconde de Pirajá',
    numero: '414',
    complemento: 'Apto 302',
    observacoes: 'Interfone tocar 2x. Deixar na porta se não atender.'
  });

  // Business Rule 2: Validation of Zona Sul Neighborhood
  const neighborhoodValidation = validateZonaSulNeighborhood(addressData.bairro);

  // Deliveries List (Synchronized between Customer and Courier views)
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);

  // UI Modals
  const [isNeighborhoodsModalOpen, setIsNeighborhoodsModalOpen] = useState(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [customerProofModalOrder, setCustomerProofModalOrder] = useState(null);

  // Pending deliveries count for header badge
  const pendingDeliveriesCount = deliveries.filter(d => d.status !== 'delivered').length;

  // Handle Recurring Payment Submission
  const handlePaymentSubmit = (cardData) => {
    if (!neighborhoodValidation.isValid) return;

    setIsProcessingPayment(true);

    setTimeout(() => {
      const newOrderId = `HNM-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder = {
        id: newOrderId,
        customerName: addressData.nome || 'Cliente Horta-na-Mão',
        customerPhone: addressData.telefone || '(21) 99999-0000',
        address: `${addressData.rua}, ${addressData.numero}${addressData.complemento ? ' - ' + addressData.complemento : ''}`,
        neighborhood: addressData.bairro,
        region: 'Zona Sul',
        planId: currentPlan.id,
        planName: `${currentPlan.name} (${currentPlan.tier} - R$ ${currentPlan.price}/sem)`,
        price: currentPlan.price,
        status: 'pending',
        recurringBilling: 'Ativo (Débito Recorrente toda Seg)',
        notes: addressData.observacoes || 'Deixar na porta do cliente.',
        createdAt: 'Agora mesmo',
        proofPhoto: null,
        deliveredAt: null
      };

      // Add to deliveries list for the Courier
      setDeliveries(prev => [newOrder, ...prev]);
      setLastCreatedOrder(newOrder);
      setIsProcessingPayment(false);

      // Confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback
      }
    }, 1200);
  };

  // Courier Actions
  const handleConfirmDelivery = (orderId, photoProofData) => {
    setDeliveries(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'delivered',
          deliveredAt: photoProofData.timestamp,
          proofPhoto: photoProofData
        };
      }
      return order;
    }));

    // Trigger celebration for successful delivery
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch (e) {}
  };

  const handleUpdateDeliveryStatus = (orderId, newStatus) => {
    setDeliveries(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col justify-between text-stone-800">
      
      {/* Header with Navigation and Business Rules Simulation Controls */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        isSundayLocked={isSundayLocked}
        setIsSundayLocked={setIsSundayLocked}
        pendingDeliveriesCount={pendingDeliveriesCount}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* VIEW 1: VISÃO DO CLIENTE */}
        {activeView === 'customer' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Active Subscriptions / Live Tracking Bar (if any orders exist) */}
            <CustomerDeliveryTracker 
              orders={deliveries} 
              onOpenProofModal={(order) => setCustomerProofModalOrder(order)} 
            />

            {/* Plan Selection (Pequeno R$50, Médio R$80, Grande R$120) */}
            <PlanSelector
              selectedPlanId={selectedPlanId}
              onSelectPlan={handleSelectPlan}
            />

            {/* Basket Customizer with Sunday 23:59h Rule Logic */}
            <BasketCustomizer
              plan={currentPlan}
              customizedItems={customizedItems}
              onSwapItem={handleSwapItem}
              onResetItems={handleResetItems}
              isSundayLocked={isSundayLocked}
              setIsSundayLocked={setIsSundayLocked}
            />

            {/* Delivery Address with Zona Sul Validation */}
            <DeliveryAddressForm
              formData={addressData}
              setFormData={setAddressData}
              validationResult={neighborhoodValidation}
              onOpenNeighborhoodsModal={() => setIsNeighborhoodsModalOpen(true)}
            />

            {/* Recurring Credit Card Payment Simulation */}
            <PaymentForm
              plan={currentPlan}
              isAddressValid={neighborhoodValidation.isValid}
              addressError={neighborhoodValidation.reason}
              onSubmitPayment={handlePaymentSubmit}
              isProcessing={isProcessingPayment}
            />

          </div>
        )}

        {/* VIEW 2: VISÃO DO ENTREGADOR */}
        {activeView === 'courier' && (
          <div className="animate-in fade-in duration-300">
            <CourierDashboard
              deliveries={deliveries}
              onConfirmDelivery={handleConfirmDelivery}
              onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Allowed Neighborhoods Modal (Zona Sul list) */}
      <AllowedNeighborhoodsModal
        isOpen={isNeighborhoodsModalOpen}
        onClose={() => setIsNeighborhoodsModalOpen(false)}
        onSelectNeighborhood={(bairro) => {
          setAddressData(prev => ({ ...prev, bairro }));
        }}
      />

      {/* Subscription Success Modal */}
      <SubscriptionSuccessModal
        order={lastCreatedOrder}
        onClose={() => setLastCreatedOrder(null)}
        onGoToCourierView={() => {
          setLastCreatedOrder(null);
          setActiveView('courier');
        }}
      />

      {/* Customer Modal to View Delivery Proof Photo */}
      {customerProofModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FAF8F5] rounded-3xl p-6 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Comprovante de Entrega na Porta
                </span>
                <h4 className="font-serif font-bold text-lg text-stone-900">
                  Sua Cesta foi Entregue! 🌱
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setCustomerProofModalOrder(null)}
                className="text-stone-400 hover:text-stone-700 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            {customerProofModalOrder.proofPhoto && (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-stone-300 shadow-md">
                  <img
                    src={customerProofModalOrder.proofPhoto.photoUrl}
                    alt="Foto da Cesta Entregue"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-stone-950/80 p-3 text-white text-[11px] font-mono space-y-0.5">
                    <div className="text-emerald-300 font-bold">
                      HORTA-NA-MÃO • COMPROVANTE GEORREFERENCIADO
                    </div>
                    <div>Horário: {customerProofModalOrder.proofPhoto.timestamp}</div>
                    <div className="text-stone-300 truncate">
                      GPS: {customerProofModalOrder.proofPhoto.coords}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                  <p><strong>Status:</strong> Cesta deixada com sucesso no endereço cadastrado.</p>
                  <p><strong>Observação do entregador:</strong> {customerProofModalOrder.proofPhoto.note}</p>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setCustomerProofModalOrder(null)}
                className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
