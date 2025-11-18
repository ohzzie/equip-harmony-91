import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';

const diagnosisSchema = z.object({
  failureCode: z.string().trim().min(1, 'Failure code is required').max(50),
  causeCode: z.string().trim().min(1, 'Cause code is required').max(50),
  remedyCode: z.string().trim().min(1, 'Remedy code is required').max(50),
  diagnosisNotes: z.string().trim().max(1000, 'Notes must be less than 1000 characters'),
});

interface DiagnosisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (diagnosis: {
    failureCode: string;
    causeCode: string;
    remedyCode: string;
    diagnosisNotes: string;
  }) => void;
  title?: string;
  description?: string;
}

export function DiagnosisModal({
  open,
  onOpenChange,
  onSubmit,
  title = "Enter Diagnosis",
  description = "Provide failure, cause, and remedy codes for this work order",
}: DiagnosisModalProps) {
  const [failureCode, setFailureCode] = useState('');
  const [causeCode, setCauseCode] = useState('');
  const [remedyCode, setRemedyCode] = useState('');
  const [diagnosisNotes, setDiagnosisNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const result = diagnosisSchema.safeParse({
      failureCode,
      causeCode,
      remedyCode,
      diagnosisNotes,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit({
      failureCode: result.data.failureCode,
      causeCode: result.data.causeCode,
      remedyCode: result.data.remedyCode,
      diagnosisNotes: result.data.diagnosisNotes,
    });

    // Reset form
    setFailureCode('');
    setCauseCode('');
    setRemedyCode('');
    setDiagnosisNotes('');
    setErrors({});
  };

  const handleCancel = () => {
    setFailureCode('');
    setCauseCode('');
    setRemedyCode('');
    setDiagnosisNotes('');
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="failureCode">
              Failure Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="failureCode"
              placeholder="e.g., F-GPU-001"
              value={failureCode}
              onChange={(e) => setFailureCode(e.target.value)}
              maxLength={50}
            />
            {errors.failureCode && (
              <p className="text-sm text-destructive">{errors.failureCode}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="causeCode">
              Cause Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="causeCode"
              placeholder="e.g., C-ELEC-012"
              value={causeCode}
              onChange={(e) => setCauseCode(e.target.value)}
              maxLength={50}
            />
            {errors.causeCode && (
              <p className="text-sm text-destructive">{errors.causeCode}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="remedyCode">
              Remedy Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="remedyCode"
              placeholder="e.g., R-REPL-004"
              value={remedyCode}
              onChange={(e) => setRemedyCode(e.target.value)}
              maxLength={50}
            />
            {errors.remedyCode && (
              <p className="text-sm text-destructive">{errors.remedyCode}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="diagnosisNotes">Technical Notes</Label>
            <Textarea
              id="diagnosisNotes"
              placeholder="Enter technical diagnosis and observations..."
              value={diagnosisNotes}
              onChange={(e) => setDiagnosisNotes(e.target.value)}
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">
              {diagnosisNotes.length}/1000 characters
            </p>
            {errors.diagnosisNotes && (
              <p className="text-sm text-destructive">{errors.diagnosisNotes}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Diagnosis</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
