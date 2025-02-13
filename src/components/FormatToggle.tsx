
import { ListFilter, Layout } from 'lucide-react';

interface FormatToggleProps {
  format: 'list' | 'preview';
  onToggle: (format: 'list' | 'preview') => void;
}

const FormatToggle = ({ format, onToggle }: FormatToggleProps) => {
  return (
    <div className="format-switch">
      <button
        onClick={() => onToggle('list')}
        className={`p-2 rounded-lg transition-all duration-300 ${
          format === 'list'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <ListFilter className="w-5 h-5" />
      </button>
      <div className="w-px h-6 bg-gray-200/50" />
      <button
        onClick={() => onToggle('preview')}
        className={`p-2 rounded-lg transition-all duration-300 ${
          format === 'preview'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Layout className="w-5 h-5" />
      </button>
    </div>
  );
};

export default FormatToggle;
