import { Dumbbell } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <Dumbbell size={22} />
          <strong>SportStore</strong>
        </div>
        <span>Інтернет-магазин спортивного одягу для активного ритму.</span>
      </div>
    </footer>
  );
}
