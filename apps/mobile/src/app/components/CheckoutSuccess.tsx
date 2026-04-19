import { useNavigate } from 'react-router-dom';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold">Thank you!</h1>
      <p className="mt-2">
        Your order has been received. We’ll be in touch shortly.
      </p>
      <button
        onClick={() => navigate('/')}
        className="mt-6 btn-secondary"
      >
        Back to home
      </button>
    </div>
  );
}
