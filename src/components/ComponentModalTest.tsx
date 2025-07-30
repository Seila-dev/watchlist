"use client"

import React from 'react';
import Button from './ui/ButtonTest';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Modal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">Modal de Teste</h2>
        <p className="mb-4">Este é um conteúdo de teste dentro do modal.</p>
        <Button variant="primary" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  );
}