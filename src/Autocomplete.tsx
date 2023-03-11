import React, { useEffect, useState, memo, useRef } from 'react';
import { findDOMNode } from 'react-dom';

type AutocompleteProps = {
    options: string[];
    inputValue: string;
    isLoading: boolean;
    onInputValueChange: React.Dispatch<React.SetStateAction<string>>;
};

type OptionProps = {
    text: string;
    isActive: boolean;
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
} & React.HtmlHTMLAttributes<HTMLDivElement> & Pick<AutocompleteProps, 'onInputValueChange' | 'inputValue'>;

// if html comes from server we should sanitize data and inject html directly into DOM using dangerouslySetInnerHTML
const highlightMatchingText = (highlight: string, text: string) => {
    // Split on highlight term and include term into parts
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    //console.log({parts});
    
    return (
        <span>
            {parts.map((part, i) => 
                <span key={`${part}-${i}`} className={part.toLowerCase() === highlight.toLowerCase() ? 'highlighted-text' : ''}>
                    {part}
                </span>
            )}
        </span>
    );
};

const Option = memo(({ inputValue, text, isActive, onInputValueChange, setActiveIndex, ...rest}: OptionProps) => {
    const optionRef = useRef<HTMLDivElement>(null);

    // scroll to the element if active - on arrow press
    useEffect(() => {
      if (isActive) {
        optionRef?.current?.scrollIntoView({ block: 'nearest' });
      }
    }, [optionRef, isActive])
    
    const onClick: React.MouseEventHandler<HTMLDivElement> = event => {
        event.preventDefault();
        event.stopPropagation();
        onInputValueChange(text);
        if (rest.tabIndex) onInputValueChange(text);
    };

    const onMouseEnter: React.MouseEventHandler<HTMLDivElement> = event => {
        event.preventDefault();
        if (rest.tabIndex) setActiveIndex(rest.tabIndex);
    };

    const className = `autocomplete-option ${isActive ? 'active' : ''}`;

    return (
        <div
            onClick={onClick}
            ref={optionRef}
            onMouseEnter={onMouseEnter}
            className={className}
            {...rest}
        >
            {highlightMatchingText(inputValue, text)}
        </div>
    );
});

const Autocomplete = ({ inputValue, options, isLoading, onInputValueChange }: AutocompleteProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuOpened, setMenuOpened] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // if prev list has less items than new list then reset index
  useEffect(() => {
    if (activeIndex > options.length - 1) {
        setActiveIndex(0);
    }
  }, [options]);
  
  // focus input on appeariance
  useEffect(() => {
    inputRef?.current?.focus();
  }, [inputRef]);

  // close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpened(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = event => {
    const enterPressed = event.key === 'Enter';
    const arrowDownPressed = event.key === 'ArrowDown';
    const arrowUpPressed = event.key === 'ArrowUp';
    
    setMenuOpened(true);

    if (enterPressed || arrowDownPressed || arrowUpPressed) {
        event.preventDefault();
    }

    if (enterPressed) {
        onInputValueChange(options[activeIndex]);
        setActiveIndex(0);
    } else if (arrowDownPressed) {
        if (activeIndex === options.length - 1) return;
        setActiveIndex(prev => prev + 1);
    } else if (arrowUpPressed) {
        if (activeIndex === 0) return;
        setActiveIndex(prev => prev - 1);
    }
  };
  
  const openMenu = () => setMenuOpened(true);

  return (
    <div className="autocomplete-select">
        <input
            value={inputValue}
            ref={inputRef}
            placeholder="Search for users..."
            type="text"
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false" 
            onFocus={openMenu}
            onKeyDown={onKeyDown}
            onChange={event => onInputValueChange(event.target.value)}
        />
        {menuOpened && (
            <div className="autocomplete-menu" ref={menuRef} onKeyDown={onKeyDown}>
                {isLoading && <div>Loading data...</div>}
                {options.map((option, index) =>
                    <Option
                        key={option}
                        tabIndex={index}
                        text={option}
                        inputValue={inputValue}
                        isActive={activeIndex === index}
                        setActiveIndex={setActiveIndex}
                        onInputValueChange={onInputValueChange}
                    />
                )}
        </div>
        )}
    </div>
  );
};

export default Autocomplete;
