import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEnergy, getTransactions } from "../api/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const [energyData, setEnergyData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(85.5);
  const [price, setPrice] = useState(0.448);
  const [priceChange, setPriceChange] = useState(-1.58);
  const [volume, setVolume] = useState(1.2);
  const [volumeChange, setVolumeChange] = useState(12.5);
  
  // Rol del usuario (obtener del token o localStorage)
  const [userRole, setUserRole] = useState('user'); // 'user' o 'admin'
  
  // Modales
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  // Formularios
  const [depositAmount, setDepositAmount] = useState('');
  const [orderType, setOrderType] = useState('market'); // 'market' o 'limit'
  const [orderAction, setOrderAction] = useState('buy'); // 'buy' o 'sell'
  const [orderAmount, setOrderAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  
  // Historial de órdenes
  const [orderHistory, setOrderHistory] = useState([]);
  
  // Estadísticas del usuario
  const [userStats, setUserStats] = useState({
    totalCompras: 0,
    totalVentas: 0,
    gananciaTotal: 0,
    operacionesHoy: 0
  });
  
  // Actividad en tiempo real
  const [recentActivity, setRecentActivity] = useState([
    { id: Date.now(), text: 'Sistema iniciado', time: new Date() }
  ]);
  
  // Chat IA
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', text: '¡Hola! Soy tu asistente de energía solar. ¿En qué puedo ayudarte?' }
  ]);
  const [aiInput, setAiInput] = useState('');
  
  // Método de pago
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const energy = await getEnergy();
      const trans = await getTransactions();
      setEnergyData(energy);
      setTransactions(trans);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDeposit = () => {
    if (depositAmount && parseFloat(depositAmount) > 0) {
      const amount = parseFloat(depositAmount);
      setBalance(prev => prev + amount);
      
      // Actualizar gráfico
      const newData = {
        name: `${chartData.length + 1}`,
        produccion: amount,
        consumo: Math.random() * 80 + 40,
      };
      setEnergyData(prev => [...prev, newData]);
      
      setDepositAmount('');
      setPaymentMethod('card');
      setShowDepositModal(false);
      alert(`✅ Depósito exitoso: ${amount} kWh mediante ${paymentMethod === 'card' ? 'Tarjeta' : paymentMethod === 'paypal' ? 'PayPal' : 'Transferencia'}`);
    }
  };

  const handleAIChat = () => {
    if (!aiInput.trim()) return;
    
    // Agregar mensaje del usuario
    const userMessage = { role: 'user', text: aiInput };
    setAiMessages(prev => [...prev, userMessage]);
    
    // Generar respuesta de IA
    setTimeout(() => {
      let response = '';
      const input = aiInput.toLowerCase();
      
      if (input.includes('precio') || input.includes('costo')) {
        response = `El precio actual es $${price.toFixed(3)} por kWh. ${priceChange > 0 ? 'Ha subido' : 'Ha bajado'} ${Math.abs(priceChange).toFixed(2)}% recientemente. ${priceChange > 0 ? 'Es buen momento para vender.' : 'Es buen momento para comprar.'}`;
      } else if (input.includes('saldo') || input.includes('balance')) {
        response = `Tu saldo actual es ${balance.toFixed(2)} kWh, equivalente a $${(balance * price).toFixed(2)} USD. ${balance < 50 ? 'Te recomiendo recargar pronto.' : 'Tienes un buen saldo disponible.'}`;
      } else if (input.includes('comprar') || input.includes('compra')) {
        response = `Para comprar energía, ve a la sección "Mercado P2P" y selecciona una oferta, o usa el botón "Nueva Orden" para crear una orden personalizada. Actualmente hay ${marketOrders.filter(o => o.type === 'sell').length} ofertas de venta disponibles.`;
      } else if (input.includes('vender') || input.includes('venta')) {
        response = `Para vender tu energía, ve al "Mercado P2P" y busca órdenes de compra, o crea una orden de venta personalizada. El precio promedio de venta es $${price.toFixed(3)} por kWh.`;
      } else if (input.includes('ganancia') || input.includes('ganar')) {
        response = `Has ganado $${userStats.gananciaTotal.toFixed(2)} en total. ${userStats.gananciaTotal > 0 ? '¡Excelente trabajo!' : 'Realiza más ventas para aumentar tus ganancias.'} Tus ventas totales son $${userStats.totalVentas.toFixed(2)}.`;
      } else if (input.includes('recargar') || input.includes('depositar')) {
        response = `Puedes recargar tu saldo haciendo clic en el botón "+ Recargar" en la tarjeta de Saldo Disponible. Aceptamos tarjeta, PayPal y transferencia bancaria.`;
      } else if (input.includes('transaccion') || input.includes('historial')) {
        response = `Has realizado ${orderHistory.length} transacciones. ${userStats.operacionesHoy} de ellas fueron hoy. Puedes ver el historial completo en la sección "Historial de Órdenes Ejecutadas".`;
      } else {
        response = `Entiendo tu pregunta sobre "${aiInput}". Puedo ayudarte con: precio actual, saldo, comprar/vender energía, ganancias, recargas y transacciones. ¿Sobre qué te gustaría saber más?`;
      }
      
      setAiMessages(prev => [...prev, { role: 'assistant', text: response }]);
    }, 500);
    
    setAiInput('');
  };

  const handleCancelOrder = (orderId) => {
    const order = orderHistory.find(o => o.id === orderId);
    if (!order) return;
    
    if (window.confirm(`¿Estás seguro de cancelar esta ${order.type === 'buy' ? 'compra' : 'venta'} de ${order.amount} kWh?`)) {
      // Revertir la transacción
      if (order.type === 'buy') {
        setBalance(prev => prev - order.amount);
        setUserStats(prev => ({
          ...prev,
          totalCompras: prev.totalCompras - order.total,
          operacionesHoy: Math.max(0, prev.operacionesHoy - 1)
        }));
      } else {
        setBalance(prev => prev + order.amount);
        setUserStats(prev => ({
          ...prev,
          totalVentas: prev.totalVentas - order.total,
          gananciaTotal: prev.gananciaTotal - order.total,
          operacionesHoy: Math.max(0, prev.operacionesHoy - 1)
        }));
      }
      
      // Eliminar del historial
      setOrderHistory(prev => prev.filter(o => o.id !== orderId));
      alert('✅ Transacción cancelada exitosamente');
    }
  };

  const handleOrder = () => {
    if (orderAmount && parseFloat(orderAmount) > 0) {
      const amount = parseFloat(orderAmount);
      const currentPrice = orderType === 'limit' ? parseFloat(limitPrice) : price;
      
      if (orderAction === 'buy') {
        setBalance(prev => prev + amount);
        setUserStats(prev => ({
          ...prev,
          totalCompras: prev.totalCompras + amount * currentPrice,
          operacionesHoy: prev.operacionesHoy + 1
        }));
      } else {
        if (balance >= amount) {
          setBalance(prev => prev - amount);
          const ganancia = amount * currentPrice;
          setUserStats(prev => ({
            ...prev,
            totalVentas: prev.totalVentas + ganancia,
            gananciaTotal: prev.gananciaTotal + ganancia,
            operacionesHoy: prev.operacionesHoy + 1
          }));
        } else {
          alert('Saldo insuficiente');
          return;
        }
      }
      
      // Agregar al historial
      const newOrder = {
        id: Date.now(),
        type: orderAction,
        orderType: orderType,
        amount: amount,
        price: currentPrice,
        total: amount * currentPrice,
        timestamp: new Date(),
        status: 'ejecutada'
      };
      
      setOrderHistory(prev => [newOrder, ...prev]);
      
      setOrderAmount('');
      setLimitPrice('');
      setShowOrderModal(false);
    }
  };

  // Datos de ejemplo para el gráfico
  const chartData = energyData.length > 0 
    ? energyData.slice(0, 20).map((item, idx) => ({
        name: `${idx + 1}`,
        produccion: item.productionKwh || 0,
        consumo: item.consumptionKwh || 0,
      }))
    : Array.from({ length: 20 }, (_, i) => ({
        name: `${i + 1}`,
        produccion: Math.random() * 100 + 50,
        consumo: Math.random() * 80 + 40,
      }));

  // Órdenes de mercado ampliadas
  const marketOrders = [
    { type: "buy", price: "$0.44", amount: "100 kWh", total: "$44.00", status: "Comprar Ahora", seller: "Productor Solar A" },
    { type: "sell", price: "$0.46", amount: "150 kWh", total: "$69.00", status: "Vender Ahora", seller: "Productor Solar B" },
    { type: "buy", price: "$0.43", amount: "200 kWh", total: "$86.00", status: "Comprar Ahora", seller: "Productor Solar C" },
    { type: "sell", price: "$0.45", amount: "120 kWh", total: "$54.00", status: "Vender Ahora", seller: "Productor Solar D" },
    { type: "buy", price: "$0.42", amount: "180 kWh", total: "$75.60", status: "Comprar Ahora", seller: "Productor Solar E" },
    { type: "sell", price: "$0.47", amount: "90 kWh", total: "$42.30", status: "Vender Ahora", seller: "Productor Solar F" },
    { type: "buy", price: "$0.44", amount: "250 kWh", total: "$110.00", status: "Comprar Ahora", seller: "Productor Solar G" },
    { type: "sell", price: "$0.46", amount: "160 kWh", total: "$73.60", status: "Vender Ahora", seller: "Productor Solar H" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Solsex</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Balance y Precio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Saldo con botón de recarga */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm opacity-90">Saldo Disponible</div>
              <button 
                onClick={() => setShowDepositModal(true)}
                className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-xs font-semibold transition"
              >
                + Recargar
              </button>
            </div>
            <div className="text-3xl font-bold">{balance.toFixed(2)} kWh</div>
            <div className="text-sm mt-2 opacity-75">≈ ${(balance * price).toFixed(2)} USD</div>
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="text-xs opacity-75">Valor por kWh: ${price.toFixed(3)}</div>
            </div>
          </div>

          {/* Precio Actual */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white relative overflow-hidden">
            <div className="text-sm opacity-90 mb-2">Precio Actual</div>
            <div className="text-3xl font-bold">${price.toFixed(3)}</div>
            <div className={`text-sm mt-2 font-semibold ${priceChange >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
              {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
            </div>
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="text-xs opacity-75">por kWh</div>
            </div>
          </div>

          {/* Volumen 24h */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <div className="text-sm opacity-90 mb-2">Volumen 24h</div>
            <div className="text-3xl font-bold">{volume.toFixed(1)}M kWh</div>
            <div className="text-sm mt-2 text-emerald-300">Total transacciones</div>
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="text-xs opacity-90">
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full flex-shrink-0"></span>
                  <span>Mercado activo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Perfil y Estadísticas del Usuario */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Estadísticas Personales */}
          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Mis Estadísticas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-emerald-600/20 rounded-lg p-4 border border-emerald-600/30">
                <div className="text-emerald-400 text-sm mb-1">Total Compras</div>
                <div className="text-white text-2xl font-bold">${userStats.totalCompras.toFixed(2)}</div>
              </div>
              <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-600/30">
                <div className="text-blue-400 text-sm mb-1">Total Ventas</div>
                <div className="text-white text-2xl font-bold">${userStats.totalVentas.toFixed(2)}</div>
              </div>
              <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-600/30">
                <div className="text-purple-400 text-sm mb-1">Ganancia Total</div>
                <div className="text-white text-2xl font-bold">${userStats.gananciaTotal.toFixed(2)}</div>
              </div>
              <div className="bg-amber-600/20 rounded-lg p-4 border border-amber-600/30">
                <div className="text-amber-400 text-sm mb-1">Operaciones Hoy</div>
                <div className="text-white text-2xl font-bold">{userStats.operacionesHoy}</div>
              </div>
            </div>
          </div>

          {/* Sugerencias de IA Mejoradas */}
          <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-indigo-600/30">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-white font-bold">Asistente IA</h3>
            </div>
            <div className="space-y-3">
              {/* Sugerencia de precio */}
              <div className="bg-slate-800/50 rounded-lg p-3 border-l-4 border-indigo-500">
                <div className="flex items-start gap-2">
                  <span className="text-lg">{priceChange > 0 ? '📈' : '📉'}</span>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">Análisis de Mercado</p>
                    <p className="text-slate-300 text-xs">
                      {priceChange > 0 
                        ? `El precio subió ${Math.abs(priceChange).toFixed(2)}%. Momento óptimo para vender. Ganancia potencial: $${(balance * price * 0.1).toFixed(2)}`
                        : `El precio bajó ${Math.abs(priceChange).toFixed(2)}%. Oportunidad de compra. Ahorra hasta $${(50 * Math.abs(priceChange) * 0.01).toFixed(2)} por cada 50 kWh`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sugerencia de actividad */}
              <div className="bg-slate-800/50 rounded-lg p-3 border-l-4 border-purple-500">
                <div className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">Recomendación Personalizada</p>
                    <p className="text-slate-300 text-xs">
                      {userStats.operacionesHoy === 0 
                        ? 'Aún no has operado hoy. Revisa las ofertas del mercado P2P para encontrar buenas oportunidades.'
                        : userStats.operacionesHoy < 3
                        ? `Has hecho ${userStats.operacionesHoy} operaciones. Considera diversificar con 2-3 transacciones más.`
                        : `¡Excelente! ${userStats.operacionesHoy} operaciones hoy. Estás maximizando tus oportunidades.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sugerencia de saldo */}
              <div className="bg-slate-800/50 rounded-lg p-3 border-l-4 border-emerald-500">
                <div className="flex items-start gap-2">
                  <span className="text-lg">💰</span>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">Gestión de Saldo</p>
                    <p className="text-slate-300 text-xs">
                      {balance < 50 
                        ? 'Tu saldo es bajo. Considera recargar para aprovechar ofertas.'
                        : balance > 200
                        ? `Tienes ${balance.toFixed(0)} kWh. Buen momento para vender y obtener ganancias.`
                        : `Saldo óptimo: ${balance.toFixed(0)} kWh. Mantén este nivel para flexibilidad.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Producción/Consumo */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-6">kWh/USD</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
              <Bar dataKey="produccion" fill="#10b981" name="Producción" />
              <Bar dataKey="consumo" fill="#ef4444" name="Consumo" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mercado P2P */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-6">Mercado P2P</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-400 text-sm border-b border-slate-700">
                  <th className="pb-3">Tipo</th>
                  <th className="pb-3">Vendedor</th>
                  <th className="pb-3">Precio</th>
                  <th className="pb-3">Cantidad</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {marketOrders.map((order, idx) => (
                  <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.type === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {order.type === 'buy' ? 'COMPRA' : 'VENTA'}
                      </span>
                    </td>
                    <td className="py-4 text-slate-300 text-sm">{order.seller}</td>
                    <td className="py-4 text-white font-semibold">{order.price}</td>
                    <td className="py-4 text-slate-300">{order.amount}</td>
                    <td className="py-4 text-slate-300">{order.total}</td>
                    <td className="py-4">
                      <button 
                        onClick={() => {
                          const amount = parseFloat(order.amount.replace(' kWh', ''));
                          const orderPrice = parseFloat(order.price.replace('$', ''));
                          
                          if (order.type === 'buy') {
                            // Si es una orden de compra en el mercado, nosotros vendemos
                            if (balance >= amount) {
                              setBalance(prev => prev - amount);
                              const ganancia = amount * orderPrice;
                              setUserStats(prev => ({
                                ...prev,
                                totalVentas: prev.totalVentas + ganancia,
                                gananciaTotal: prev.gananciaTotal + ganancia,
                                operacionesHoy: prev.operacionesHoy + 1
                              }));
                              setOrderHistory(prev => [{
                                id: Date.now(),
                                type: 'sell',
                                orderType: 'market',
                                amount: amount,
                                price: orderPrice,
                                total: ganancia,
                                timestamp: new Date(),
                                status: 'ejecutada'
                              }, ...prev]);
                              alert(`¡Venta exitosa! Vendiste ${amount} kWh por $${ganancia.toFixed(2)}`);
                            } else {
                              alert('Saldo insuficiente para vender');
                            }
                          } else {
                            // Si es una orden de venta en el mercado, nosotros compramos
                            setBalance(prev => prev + amount);
                            const costo = amount * orderPrice;
                            setUserStats(prev => ({
                              ...prev,
                              totalCompras: prev.totalCompras + costo,
                              operacionesHoy: prev.operacionesHoy + 1
                            }));
                            setOrderHistory(prev => [{
                              id: Date.now(),
                              type: 'buy',
                              orderType: 'market',
                              amount: amount,
                              price: orderPrice,
                              total: costo,
                              timestamp: new Date(),
                              status: 'ejecutada'
                            }, ...prev]);
                            alert(`¡Compra exitosa! Compraste ${amount} kWh por $${costo.toFixed(2)}`);
                          }
                        }}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          order.type === 'buy' 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        {order.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Historial de Órdenes Ejecutadas */}
        {orderHistory.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">Historial de Órdenes Ejecutadas</h2>
            <div className="space-y-3">
              {orderHistory.map((order) => (
                <div key={order.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.type === 'buy' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {order.type === 'buy' ? 'COMPRA' : 'VENTA'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.orderType === 'market'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {order.orderType === 'market' ? 'A MERCADO' : 'LIMITADA'}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div>
                          <p className="text-slate-400 text-xs">Cantidad</p>
                          <p className="text-white font-semibold">{order.amount.toFixed(2)} kWh</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Precio</p>
                          <p className="text-white font-semibold">${order.price.toFixed(3)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Total</p>
                          <p className="text-emerald-400 font-bold">${order.total.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Fecha</p>
                          <p className="text-white text-sm">{order.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-slate-800/50 rounded border border-slate-600 flex justify-between items-center">
                        <p className="text-slate-300 text-sm flex-1">
                          <span className="font-semibold">Resumen:</span> {order.type === 'buy' ? 'Compraste' : 'Vendiste'} {order.amount.toFixed(2)} kWh 
                          {order.orderType === 'market' 
                            ? ' al precio de mercado' 
                            : ` con precio límite de $${order.price.toFixed(3)}`
                          } por un total de ${order.total.toFixed(2)} USD
                        </p>
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="ml-3 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 rounded-lg transition text-sm font-semibold"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Proceso de Trading */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-6">Proceso de Trading de Energía</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Paso 1: Apertura de cuenta */}
            <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-700/20 border border-emerald-600/30 rounded-lg p-4 hover:border-emerald-500 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <h3 className="text-white font-semibold">Apertura de Cuenta</h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">Registro con datos personales y financieros en la plataforma</p>
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition font-semibold">
                Completado ✓
              </button>
            </div>

            {/* Paso 2: Depósito de fondos */}
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border border-blue-600/30 rounded-lg p-4 hover:border-blue-500 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <h3 className="text-white font-semibold">Depósito de Fondos</h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">Depositar dinero para financiar compras de energía</p>
              <button 
                onClick={() => setShowDepositModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-semibold"
              >
                Depositar
              </button>
            </div>

            {/* Paso 3: Selección */}
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 border border-purple-600/30 rounded-lg p-4 hover:border-purple-500 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                <h3 className="text-white font-semibold">Selección</h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">Investigar y elegir ofertas de energía disponibles</p>
              <button 
                onClick={() => setShowOffersModal(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition font-semibold"
              >
                Ver Ofertas
              </button>
            </div>

            {/* Paso 4: Realizar Orden */}
            <div className="bg-gradient-to-br from-amber-600/20 to-amber-700/20 border border-amber-600/30 rounded-lg p-4 hover:border-amber-500 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                <h3 className="text-white font-semibold">Realizar Orden</h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">Enviar orden de compra o venta al mercado</p>
              <button 
                onClick={() => setShowOrderModal(true)}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition font-semibold"
              >
                Nueva Orden
              </button>
            </div>
          </div>

          {/* Tipos de Órdenes */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Órdenes a Mercado
              </h4>
              <p className="text-slate-300 text-sm">Compra o venta al precio más conveniente del momento</p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Órdenes Limitadas
              </h4>
              <p className="text-slate-300 text-sm">Compra o venta solo si el precio alcanza un nivel específico</p>
            </div>
          </div>

          {/* Pasos finales */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-indigo-600/20 to-indigo-700/20 border border-indigo-600/30 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">5. Ejecución y Posesión</h4>
              <p className="text-slate-300 text-sm">Una vez ejecutada la orden, la energía se transfiere a tu propiedad y el dinero se descuenta de tu cuenta</p>
            </div>
            <div className="bg-gradient-to-r from-pink-600/20 to-pink-700/20 border border-pink-600/30 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">6. Seguimiento y Venta</h4>
              <p className="text-slate-300 text-sm">Sigue el rendimiento de tus inversiones y vende cuando decidas. Las ganancias se depositan en tu cuenta</p>
            </div>
          </div>
        </div>

        {/* Transacciones Recientes */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-6">Transacciones Recientes</h2>
          {transactions.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No hay transacciones aún</p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg">
                  <div>
                    <div className="text-white font-semibold">{tx.amountKwh} kWh</div>
                    <div className="text-slate-400 text-sm">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-emerald-400 font-semibold">
                    ${(tx.amountKwh * 0.45).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Depósito Mejorado */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-2">Recargar Energía</h3>
            <p className="text-slate-400 text-sm mb-4">Selecciona o ingresa la cantidad de kWh</p>
            
            {/* Opciones rápidas */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[50, 100, 200].map(amount => (
                <button
                  key={amount}
                  onClick={() => setDepositAmount(amount.toString())}
                  className={`py-3 rounded-lg border-2 transition ${
                    depositAmount === amount.toString()
                      ? 'border-blue-500 bg-blue-500/20 text-white'
                      : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-blue-500/50'
                  }`}
                >
                  <div className="text-lg font-bold">{amount}</div>
                  <div className="text-xs opacity-75">kWh</div>
                </button>
              ))}
            </div>

            {/* Input personalizado */}
            <div className="mb-4">
              <label className="text-slate-300 text-sm mb-2 block">Cantidad personalizada</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Ej: 150"
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Método de pago */}
            <div className="mb-4">
              <label className="text-slate-300 text-sm mb-2 block">Método de pago</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-lg border-2 transition ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-600 bg-slate-700 hover:border-blue-500/50'
                  }`}
                >
                  <div className="text-2xl mb-1">💳</div>
                  <div className="text-xs text-white">Tarjeta</div>
                </button>
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-lg border-2 transition ${
                    paymentMethod === 'paypal'
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-600 bg-slate-700 hover:border-blue-500/50'
                  }`}
                >
                  <div className="text-2xl mb-1">🅿️</div>
                  <div className="text-xs text-white">PayPal</div>
                </button>
                <button
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-3 rounded-lg border-2 transition ${
                    paymentMethod === 'transfer'
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-600 bg-slate-700 hover:border-blue-500/50'
                  }`}
                >
                  <div className="text-2xl mb-1">🏦</div>
                  <div className="text-xs text-white">Transfer</div>
                </button>
              </div>
            </div>

            {/* Resumen */}
            {depositAmount && parseFloat(depositAmount) > 0 && (
              <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-3 mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Cantidad:</span>
                  <span className="text-white font-semibold">{parseFloat(depositAmount).toFixed(2)} kWh</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Valor estimado:</span>
                  <span className="text-white font-semibold">${(parseFloat(depositAmount) * price).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Nuevo saldo:</span>
                  <span className="text-emerald-400 font-bold">{(balance + parseFloat(depositAmount)).toFixed(2)} kWh</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDepositModal(false);
                  setDepositAmount('');
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeposit}
                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg transition font-semibold"
              >
                Confirmar Recarga
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Ofertas */}
      {showOffersModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full border border-slate-700 max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Ofertas Disponibles</h3>
            <div className="space-y-3">
              {[
                { seller: 'Productor Solar A', amount: 150, price: 0.44, rating: 4.8 },
                { seller: 'Productor Solar B', amount: 200, price: 0.45, rating: 4.9 },
                { seller: 'Productor Solar C', amount: 100, price: 0.43, rating: 4.7 },
                { seller: 'Productor Solar D', amount: 250, price: 0.46, rating: 4.6 },
              ].map((offer, idx) => (
                <div key={idx} className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700 transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-semibold">{offer.seller}</h4>
                      <p className="text-slate-300 text-sm">{offer.amount} kWh disponibles</p>
                      <p className="text-amber-400 text-sm">★ {offer.rating}/5.0</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold text-xl">${offer.price}</p>
                      <p className="text-slate-400 text-sm">por kWh</p>
                      <button 
                        onClick={() => {
                          setShowOffersModal(false);
                          setShowOrderModal(true);
                          setOrderAction('buy');
                        }}
                        className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1 rounded text-sm"
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowOffersModal(false)}
              className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Nueva Orden */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-4">Nueva Orden</h3>
            
            {/* Tipo de acción */}
            <div className="mb-4">
              <label className="text-slate-300 text-sm mb-2 block">Acción</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setOrderAction('buy')}
                  className={`py-2 rounded-lg transition ${
                    orderAction === 'buy' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Comprar
                </button>
                <button
                  onClick={() => setOrderAction('sell')}
                  className={`py-2 rounded-lg transition ${
                    orderAction === 'sell' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Vender
                </button>
              </div>
            </div>

            {/* Tipo de orden */}
            <div className="mb-4">
              <label className="text-slate-300 text-sm mb-2 block">Tipo de Orden</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setOrderType('market')}
                  className={`py-2 rounded-lg transition ${
                    orderType === 'market' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  A Mercado
                </button>
                <button
                  onClick={() => setOrderType('limit')}
                  className={`py-2 rounded-lg transition ${
                    orderType === 'limit' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Limitada
                </button>
              </div>
              <p className="text-slate-400 text-xs mt-2">
                {orderType === 'market' 
                  ? 'Se ejecuta al precio actual del mercado' 
                  : 'Se ejecuta solo si el precio alcanza tu límite'}
              </p>
            </div>

            {/* Cantidad */}
            <div className="mb-4">
              <label className="text-slate-300 text-sm mb-2 block">Cantidad (kWh)</label>
              <input
                type="number"
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value)}
                placeholder="Ej: 50"
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Precio límite (solo si es orden limitada) */}
            {orderType === 'limit' && (
              <div className="mb-4">
                <label className="text-slate-300 text-sm mb-2 block">Precio Límite (USD)</label>
                <input
                  type="number"
                  step="0.001"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  placeholder={`Precio actual: $${price.toFixed(3)}`}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            )}

            {/* Resumen */}
            <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
              <p className="text-slate-300 text-sm">
                <span className="font-semibold">Precio estimado:</span> ${price.toFixed(3)} por kWh
              </p>
              {orderAmount && (
                <p className="text-slate-300 text-sm mt-1">
                  <span className="font-semibold">Total:</span> ${(parseFloat(orderAmount) * price).toFixed(2)} USD
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowOrderModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleOrder}
                className={`flex-1 py-2 rounded-lg transition font-semibold ${
                  orderAction === 'buy'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {orderAction === 'buy' ? 'Comprar' : 'Vender'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante de IA */}
      <button
        onClick={() => setShowAIChat(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center z-40"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Modal de Chat IA */}
      {showAIChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl w-full max-w-2xl h-[600px] border border-slate-700 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold">Asistente IA</h3>
                  <p className="text-slate-400 text-xs">Pregúntame lo que quieras</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIChat(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-200'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAIChat()}
                  placeholder="Pregunta sobre precio, saldo, compras..."
                  className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  onClick={handleAIChat}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-semibold"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
