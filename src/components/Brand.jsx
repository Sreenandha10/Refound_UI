import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png' // Adjust path if your folder structure differs

export default function Brand({ to = '/', light = false }) {
  return (
    <Link 
      to={to} 
      className={`inline-flex items-center gap-2 font-heading text-2xl font-bold tracking-wide ${light ? 'text-cream' : 'text-forest'}`}
    >
      <img 
        src={logoImg} 
        alt="ReFound Logo" 
        className="h-12 w-12 object-contain scale-125" 
      />
      <span className="-ml-4">REFOUND</span>
    </Link>
  );
}