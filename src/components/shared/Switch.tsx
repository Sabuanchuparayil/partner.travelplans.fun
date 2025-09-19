
import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange, label }) => {
  const handleToggle = () => {
    onChange(!checked);
  };

  return (
    <div className="flex items-center">
      <span className={`mr-3 text-sm font-medium ${checked ? 'text-green-600' : 'text-red-600'}`}>
        {label}
      </span>
      <button
        type="button"
        className={`${checked ? 'bg-green-500' : 'bg-red-500'} 
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-offset-2`}
        role="switch"
        aria-checked={checked}
        onClick={handleToggle}
      >
        <span
          aria-hidden="true"
          className={`${checked ? 'translate-x-5' : 'translate-x-0'} 
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
};

export default Switch;
