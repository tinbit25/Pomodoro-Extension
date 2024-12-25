import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; 

const Input = ({ icon: Icon, label, type, onToggleVisibility, ...props }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(type === 'password' ? false : true);

  const handleToggleVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
    if (onToggleVisibility) {
      onToggleVisibility();
    }
  };

  return (
    <div className='relative mb-6'>
      {label && (
        <label htmlFor={props.name} className="text-gray-300 text-sm mb-2 block">
          {label}
        </label>
      )}
      <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
        {Icon && <Icon className="w-5 h-5 text-green-500" />}
      </div>
      <input
        {...props}
        id={props.name}
        type={isPasswordVisible ? 'text' : 'password'}
        className='w-full pl-10 py-3 bg-gray-800 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200'
      />
      {type === 'password' && (
        <button
          type="button"
          className="absolute inset-y-0 right-3 flex items-center"
          onClick={handleToggleVisibility}
        >
          {isPasswordVisible ? (
            <EyeOff className="w-5 h-5 py-2 text-gray-400" />
          ) : (
            <Eye className="w-5 h-5 py-2 text-gray-400" />
          )}
        </button>
      )}
    </div>
  );
};

export default Input;
