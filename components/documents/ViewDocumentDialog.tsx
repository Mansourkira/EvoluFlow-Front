import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Document, formatPrice, formatDelay } from '@/schemas/documentShema';

interface ViewDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  document: Document;
}

export function ViewDocumentDialog({ open, onClose, document }: ViewDocumentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">📄 Détails du document</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mt-4">
          <Detail label="Référence" value={document.Reference} />
          <Detail label="Nom" value={document.Nom_Document} />
          <Detail label="Type" value={document.Type} />
          <Detail label="Filière" value={document.Reference_Filiere} />
          <Detail label="Lieu d'extraction" value={document.Lieu_Extraction} />
          <Detail label="Observation" value={document.Observation} />
          <Detail label="Obligatoire" value={document.Obligatoire ? 'Oui' : 'Non'} />
          <Detail label="Nécessaire Examen" value={document.Necessaire_Examen ? 'Oui' : 'Non'} />
          <Detail label="Délai de traitement" value={formatDelay(document.Delai_Traitement)} />
          <Detail label="Prix de traitement" value={formatPrice(document.Prix_Traitement)} />
          <Detail label="Ordre" value={document.Ordre?.toString() || '-'} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ✅ Composant pour chaque ligne
type DetailProps = { label: string; value?: string | null };
function Detail({ label, value }: DetailProps) {
  return (
    <div className="flex flex-col">
      <span className="font-medium text-gray-900">{label}</span>
      <span className="text-gray-600">{value ?? '-'}</span>
    </div>
  );
}

// ✅ Exportation correcte
export default ViewDocumentDialog;
