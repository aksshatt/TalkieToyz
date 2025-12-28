import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  MapPin,
  Truck,
  CreditCard,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import StateCitySelector from '../components/common/StateCitySelector';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchCart, resetCart } from '../store/slices/cartSlice';
import orderService from '../services/orderService';
import toast from 'react-hot-toast';
import type { Address, PaymentMethod } from '../types/order';

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}

const steps = [
  { id: 1, name: 'Shipping', icon: MapPin },
  { id: 2, name: 'Delivery', icon: Truck },
  { id: 3, name: 'Payment', icon: CreditCard },
  { id: 4, name: 'Review', icon: CheckCircle },
];

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.cart);

  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>(
    'standard'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const couponCode = location.state?.couponCode;
  const discount = location.state?.discount || 0;

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (!cart || cart.cart_items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const addressSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone must be 10 digits')
      .required('Phone is required'),
    address_line_1: Yup.string().required('Address is required'),
    address_line_2: Yup.string(),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    postal_code: Yup.string()
      .matches(/^[0-9]{6}$/, 'PIN code must be 6 digits')
      .required('PIN code is required'),
    country: Yup.string().required('Country is required'),
  });

  const formik = useFormik<Address>({
    initialValues: {
      name: '',
      phone: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
    },
    validationSchema: addressSchema,
    onSubmit: async (values) => {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        await handlePlaceOrder(values);
      }
    },
  });

  const handlePlaceOrder = async (shippingAddress: Address) => {
    setIsProcessing(true);
    try {
      // Create order
      const orderResponse = await orderService.createOrder({
        payment_method: paymentMethod,
        shipping_address: shippingAddress,
        billing_address: shippingAddress,
        coupon_code: couponCode,
      });

      const order = orderResponse.data;

      if (paymentMethod === 'razorpay') {
        // Create Razorpay order
        const razorpayResponse = await orderService.createRazorpayOrder(
          order.id
        );

        // Initialize Razorpay
        const options = {
          key: razorpayResponse.razorpay_key_id,
          amount: razorpayResponse.amount,
          currency: 'INR',
          name: 'TalkieToys',
          description: `Order #${order.order_number}`,
          order_id: razorpayResponse.razorpay_order_id,
          handler: async function (response: any) {
            try {
              // Verify payment
              await orderService.verifyPayment(order.id, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              dispatch(resetCart());
              toast.success('Payment successful!');
              navigate('/order-confirmation', {
                state: { orderId: order.id },
              });
            } catch (error) {
              toast.error('Payment verification failed');
              navigate('/orders');
            }
          },
          prefill: {
            name: shippingAddress.name,
            contact: shippingAddress.phone,
          },
          theme: {
            color: '#9333ea',
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.failed', function () {
          toast.error('Payment failed. Please try again.');
          navigate('/orders');
        });

        razorpay.open();
      } else {
        // COD order
        dispatch(resetCart());
        toast.success('Order placed successfully!');
        navigate('/order-confirmation', {
          state: { orderId: order.id },
        });
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to create order'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      const errors = await formik.validateForm();
      if (Object.keys(errors).length === 0) {
        setCurrentStep(2);
      } else {
        formik.setTouched({
          name: true,
          phone: true,
          address_line_1: true,
          city: true,
          state: true,
          postal_code: true,
          country: true,
        });
      }
    } else if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateTotal = () => {
    if (!cart) return 0;
    return parseFloat(cart.total) - discount;
  };

  if (!cart) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Progress Steps */}
          <div className="bg-white rounded-2xl p-6 shadow-playful mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        currentStep >= step.id
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      } transition-colors`}
                    >
                      <step.icon className="h-6 w-6" />
                    </div>
                    <span
                      className={`text-sm font-semibold mt-2 ${
                        currentStep >= step.id
                          ? 'text-purple-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 ${
                        currentStep > step.id
                          ? 'bg-purple-500'
                          : 'bg-gray-200'
                      } transition-colors`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={formik.handleSubmit}>
            <div className="bg-white rounded-2xl p-8 shadow-playful mb-6">
              {/* Step 1: Shipping Address */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-3xl font-[var(--font-family-fun)] font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <MapPin className="h-8 w-8 text-purple-600" />
                    Shipping Address
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                      />
                      {formik.touched.name && formik.errors.name && (
                        <p className="text-red-600 text-sm mt-1">
                          {formik.errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="10-digit number"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                      />
                      {formik.touched.phone && formik.errors.phone && (
                        <p className="text-red-600 text-sm mt-1">
                          {formik.errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="postal_code"
                        value={formik.values.postal_code}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="6-digit PIN"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                      />
                      {formik.touched.postal_code &&
                        formik.errors.postal_code && (
                          <p className="text-red-600 text-sm mt-1">
                            {formik.errors.postal_code}
                          </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        name="address_line_1"
                        value={formik.values.address_line_1}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="House No., Building Name"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                      />
                      {formik.touched.address_line_1 &&
                        formik.errors.address_line_1 && (
                          <p className="text-red-600 text-sm mt-1">
                            {formik.errors.address_line_1}
                          </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        name="address_line_2"
                        value={formik.values.address_line_2}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Road Name, Area, Colony"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>

                    <StateCitySelector
                      stateValue={formik.values.state}
                      cityValue={formik.values.city}
                      onStateChange={(value) => formik.setFieldValue('state', value)}
                      onCityChange={(value) => formik.setFieldValue('city', value)}
                      stateError={formik.errors.state}
                      cityError={formik.errors.city}
                      stateTouched={formik.touched.state}
                      cityTouched={formik.touched.city}
                    />

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formik.values.country}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                      />
                      {formik.touched.country && formik.errors.country && (
                        <p className="text-red-600 text-sm mt-1">
                          {formik.errors.country}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Delivery Method */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-3xl font-[var(--font-family-fun)] font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <Truck className="h-8 w-8 text-purple-600" />
                    Delivery Method
                  </h2>

                  <div className="space-y-4">
                    <label
                      className={`flex items-center justify-between p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        deliveryMethod === 'standard'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="delivery"
                          value="standard"
                          checked={deliveryMethod === 'standard'}
                          onChange={(e) =>
                            setDeliveryMethod(
                              e.target.value as 'standard' | 'express'
                            )
                          }
                          className="w-5 h-5 text-purple-600"
                        />
                        <div>
                          <p className="font-bold text-gray-800">
                            Standard Delivery
                          </p>
                          <p className="text-sm text-gray-600">
                            5-7 business days
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-purple-600">FREE</span>
                    </label>

                    <label
                      className={`flex items-center justify-between p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        deliveryMethod === 'express'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="delivery"
                          value="express"
                          checked={deliveryMethod === 'express'}
                          onChange={(e) =>
                            setDeliveryMethod(
                              e.target.value as 'standard' | 'express'
                            )
                          }
                          className="w-5 h-5 text-purple-600"
                        />
                        <div>
                          <p className="font-bold text-gray-800">
                            Express Delivery
                          </p>
                          <p className="text-sm text-gray-600">
                            2-3 business days
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-purple-600">
                        ₹100.00
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-3xl font-[var(--font-family-fun)] font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-purple-600" />
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    <label
                      className={`flex items-center justify-between p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === 'razorpay'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="payment"
                          value="razorpay"
                          checked={paymentMethod === 'razorpay'}
                          onChange={(e) =>
                            setPaymentMethod(
                              e.target.value as PaymentMethod
                            )
                          }
                          className="w-5 h-5 text-purple-600"
                        />
                        <div>
                          <p className="font-bold text-gray-800">
                            Online Payment
                          </p>
                          <p className="text-sm text-gray-600">
                            Credit Card, Debit Card, UPI, Netbanking
                          </p>
                        </div>
                      </div>
                    </label>

                    <label
                      className={`flex items-center justify-between p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={(e) =>
                            setPaymentMethod(
                              e.target.value as PaymentMethod
                            )
                          }
                          className="w-5 h-5 text-purple-600"
                        />
                        <div>
                          <p className="font-bold text-gray-800">
                            Cash on Delivery
                          </p>
                          <p className="text-sm text-gray-600">
                            Pay when you receive your order
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 4: Order Review */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-3xl font-[var(--font-family-fun)] font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                    Review Order
                  </h2>

                  <div className="space-y-6">
                    {/* Shipping Address */}
                    <div>
                      <h3 className="font-bold text-gray-800 mb-2">
                        Shipping Address
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 text-sm">
                        <p className="font-semibold">{formik.values.name}</p>
                        <p>{formik.values.phone}</p>
                        <p>{formik.values.address_line_1}</p>
                        {formik.values.address_line_2 && (
                          <p>{formik.values.address_line_2}</p>
                        )}
                        <p>
                          {formik.values.city}, {formik.values.state} -{' '}
                          {formik.values.postal_code}
                        </p>
                        <p>{formik.values.country}</p>
                      </div>
                    </div>

                    {/* Delivery & Payment */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-bold text-gray-800 mb-2">
                          Delivery Method
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 text-sm">
                          <p className="font-semibold">
                            {deliveryMethod === 'standard'
                              ? 'Standard Delivery'
                              : 'Express Delivery'}
                          </p>
                          <p className="text-gray-600">
                            {deliveryMethod === 'standard'
                              ? '5-7 business days'
                              : '2-3 business days'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-800 mb-2">
                          Payment Method
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 text-sm">
                          <p className="font-semibold">
                            {paymentMethod === 'razorpay'
                              ? 'Online Payment'
                              : 'Cash on Delivery'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="font-bold text-gray-800 mb-2">
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {cart.cart_items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 bg-gray-50 rounded-lg p-4"
                          >
                            <img
                              src={
                                item.product.image_urls[0]?.url ||
                                '/placeholder-product.png'
                              }
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">
                                {item.product.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-bold text-purple-600">
                              ₹{parseFloat(item.total_price).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-purple-50 rounded-lg p-6">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>₹{parseFloat(cart.subtotal).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>
                            ₹{parseFloat(cart.tax_amount).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery</span>
                          <span>
                            {deliveryMethod === 'standard'
                              ? 'FREE'
                              : '₹100.00'}
                          </span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-₹{discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="border-t-2 border-purple-200 pt-2 mt-2 flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span className="text-purple-600">
                            ₹{calculateTotal().toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-bold rounded-xl shadow-playful hover:shadow-playful-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Back
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-playful hover:shadow-playful-hover transform hover:scale-105 transition-all"
                >
                  Next
                  <ChevronRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="ml-auto flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-playful hover:shadow-playful-hover transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Place Order
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
