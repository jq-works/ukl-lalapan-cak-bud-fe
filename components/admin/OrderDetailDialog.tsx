"use client";

import React from "react";
import { Order, STATUS_CONFIG } from "@/app/admin/layout";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface OrderDetailDialogProps {
  editingOrder: Order | null;
  setEditingOrder: (order: Order | null) => void;
  handleUpdateStatus: (id: string, newStatus: Order["status"]) => void;
}

export function OrderDetailDialog({
  editingOrder,
  setEditingOrder,
  handleUpdateStatus,
}: OrderDetailDialogProps) {
  return (
    <AlertDialog open={!!editingOrder} onOpenChange={(open) => { if (!open) setEditingOrder(null); }}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold text-stone-900 text-lg">Koreksi Status Pesanan</AlertDialogTitle>
          <AlertDialogDescription className="text-stone-500 text-xs">
            Ubah status untuk pesanan <span className="font-mono font-semibold text-stone-900">#{editingOrder?.id}</span> milik <span className="font-semibold text-stone-900">{editingOrder?.customerName}</span> secara manual.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="px-6 pb-6 space-y-3">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Pilih Status Baru:</label>
          <div className="grid grid-cols-2 gap-2.5">
            {(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"] as const).map((status) => {
              const config = STATUS_CONFIG[status];
              const isSelected = editingOrder?.status === status;
              
              // Tailored active styles matching the status's color family
              const activeStyles = {
                PENDING: "bg-amber-50 text-amber-700 border-amber-400 shadow-sm shadow-amber-100",
                PROCESSING: "bg-blue-50 text-blue-700 border-blue-400 shadow-sm shadow-blue-100",
                COMPLETED: "bg-stone-100 text-stone-855 border-stone-400 shadow-sm shadow-stone-100",
                CANCELLED: "bg-red-50 text-red-700 border-red-400 shadow-sm shadow-red-100",
              }[status];

              return (
                <button
                  key={status}
                  onClick={() => {
                    if (editingOrder) {
                      setEditingOrder({ ...editingOrder, status });
                    }
                  }}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? activeStyles
                      : "bg-white text-stone-600 border-stone-100 hover:bg-stone-50"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel 
            onClick={() => setEditingOrder(null)} 
            className="cursor-pointer border-stone-100 text-stone-600 font-semibold text-xs py-2 px-4 rounded-xl"
          >
            Batal
          </AlertDialogCancel>
          <button
            onClick={() => {
              if (editingOrder) {
                handleUpdateStatus(editingOrder.id, editingOrder.status);
                setEditingOrder(null);
              }
            }}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            Simpan Perubahan
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
