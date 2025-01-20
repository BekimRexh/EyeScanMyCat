import React, { createContext, useContext, useState } from 'react';


interface ScanStateContextType {
  scanState: { someKey: boolean };
  setScanState: React.Dispatch<React.SetStateAction<{ someKey: boolean }>>;
}


const ScanStateContext = createContext<ScanStateContextType | null>(null);

export const ScanStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scanState, setScanState] = useState({ someKey: false }); 

  return (
    <ScanStateContext.Provider value={{ scanState, setScanState }}>
      {children}
    </ScanStateContext.Provider>
  );
};

export const useScanState = (): ScanStateContextType => {
  const context = useContext(ScanStateContext);

  if (!context) {
    throw new Error('useScanState must be used within a ScanStateProvider');
  }

  return context;
};
