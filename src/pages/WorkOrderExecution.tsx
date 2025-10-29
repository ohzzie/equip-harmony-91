import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_WORK_ORDERS, MOCK_PARTS } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Camera,
  Package,
  Trash2,
  Save,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PartUsed {
  partId: string;
  partName: string;
  quantity: number;
  unitCost: number;
}

interface PartRequest {
  partId: string;
  partName: string;
  quantity: number;
  reason: string;
}

export default function WorkOrderExecution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const workOrder = MOCK_WORK_ORDERS.find(wo => wo.id === id);

  const [partsUsed, setPartsUsed] = useState<PartUsed[]>([]);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [partRequests, setPartRequests] = useState<PartRequest[]>([]);
  const [requestReason, setRequestReason] = useState('');

  if (!workOrder) {
    return (
      <div className="container py-8">
        <p className="text-muted-foreground">Work order not found</p>
      </div>
    );
  }

  const handleAddPart = (partId: string) => {
    const part = MOCK_PARTS.find(p => p.id === partId);
    if (!part) return;

    const existing = partsUsed.find(p => p.partId === partId);
    if (existing) {
      setPartsUsed(partsUsed.map(p =>
        p.partId === partId ? { ...p, quantity: p.quantity + 1 } : p
      ));
    } else {
      setPartsUsed([...partsUsed, {
        partId: part.id,
        partName: part.name,
        quantity: 1,
        unitCost: part.unitCost,
      }]);
    }

    toast({
      title: 'Part Added',
      description: `${part.name} added to work order`,
    });
  };

  const handleRemovePart = (partId: string) => {
    setPartsUsed(partsUsed.filter(p => p.partId !== partId));
  };

  const handleRequestPart = (partId: string) => {
    const part = MOCK_PARTS.find(p => p.id === partId);
    if (!part) return;

    const existing = partRequests.find(p => p.partId === partId);
    if (existing) {
      setPartRequests(partRequests.map(p =>
        p.partId === partId ? { ...p, quantity: p.quantity + 1 } : p
      ));
    } else {
      setPartRequests([...partRequests, {
        partId: part.id,
        partName: part.name,
        quantity: 1,
        reason: '',
      }]);
    }
  };

  const handleRemovePartRequest = (partId: string) => {
    setPartRequests(partRequests.filter(p => p.partId !== partId));
  };

  const handleSubmitPartRequest = () => {
    if (partRequests.length === 0) {
      toast({
        title: 'No Parts Selected',
        description: 'Please add parts to the request',
        variant: 'destructive',
      });
      return;
    }

    const hasEmptyReason = partRequests.some(p => !p.reason.trim());
    if (hasEmptyReason) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a reason for each part request',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Part Request Submitted',
      description: 'Your request has been sent to the inventory manager for approval',
    });
    setShowRequestDialog(false);
    setPartRequests([]);
    setRequestReason('');
  };

  const handlePhotoCapture = () => {
    // In real implementation, this would open camera
    const photoUrl = `photo-${Date.now()}.jpg`;
    setPhotos([...photos, photoUrl]);
    toast({
      title: 'Photo Captured',
      description: 'Photo added to work order',
    });
  };

  const handleSave = () => {
    toast({
      title: 'Progress Saved',
      description: 'Work order updated successfully',
    });
  };

  const handleComplete = () => {
    if (partsUsed.length === 0) {
      toast({
        title: 'No Parts Logged',
        description: 'Please add parts used or confirm none were needed',
        variant: 'destructive',
      });
      return;
    }

    setShowCompleteDialog(true);
  };

  const confirmComplete = () => {
    toast({
      title: 'Work Order Completed',
      description: `WO ${workOrder.id} marked as complete and sent for verification`,
    });
    navigate(`/work-orders/${workOrder.id}`);
  };

  const totalPartsCost = partsUsed.reduce((sum, part) => 
    sum + (part.quantity * part.unitCost), 0
  );

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={`/work-orders/${workOrder.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{workOrder.id}</h1>
          <p className="text-muted-foreground">{workOrder.title}</p>
        </div>
        <StatusBadge status={workOrder.priority} />
      </div>

      {/* Equipment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Equipment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Equipment: </span>
              <span className="font-medium">{workOrder.equipmentName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Location: </span>
              <span className="font-medium">{workOrder.site} - {workOrder.area}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Type: </span>
              <span className="font-medium capitalize">{workOrder.type}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Priority: </span>
              <span className="font-medium capitalize">{workOrder.priority}</span>
            </div>
          </div>
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">Issue Description:</p>
            <p className="text-sm">{workOrder.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Parts Used */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Parts & Consumables Used
            </CardTitle>
            <Button onClick={() => setShowRequestDialog(true)} variant="outline" size="sm" className="gap-2">
              <Send className="h-4 w-4" />
              Request Parts
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select onValueChange={handleAddPart}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select part to add..." />
              </SelectTrigger>
              <SelectContent>
                {MOCK_PARTS.map(part => (
                  <SelectItem key={part.id} value={part.id}>
                    {part.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {partsUsed.length > 0 ? (
            <div className="space-y-2">
              {partsUsed.map(part => (
                <div key={part.partId} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex-1">
                    <p className="font-medium">{part.partName}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {part.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={part.quantity}
                      onChange={(e) => {
                        const qty = parseInt(e.target.value) || 1;
                        setPartsUsed(partsUsed.map(p =>
                          p.partId === part.partId ? { ...p, quantity: qty } : p
                        ));
                      }}
                      className="w-20"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePart(part.partId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              No parts added yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Photos ({photos.length})
            </div>
            <Button onClick={handlePhotoCapture} size="sm" className="gap-2">
              <Camera className="h-4 w-4" />
              Capture Photo
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {photos.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo, idx) => (
                <div key={idx} className="aspect-square rounded-lg border bg-muted flex items-center justify-center">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              No photos captured yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Work Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Work Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add notes about the work performed, issues encountered, recommendations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 sticky bottom-4 bg-background/95 backdrop-blur-sm border rounded-lg p-4">
        <Button onClick={handleSave} variant="outline" className="flex-1 gap-2">
          <Save className="h-4 w-4" />
          Save Progress
        </Button>
        <Button onClick={handleComplete} className="flex-1 gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Complete Work Order
        </Button>
      </div>

      {/* Complete Confirmation Dialog */}
      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Work Order?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>This will mark the work order as completed and send it for verification.</p>
              <div className="mt-4 space-y-1 text-sm">
                <p><strong>Parts Used:</strong> {partsUsed.length} items</p>
                <p><strong>Photos:</strong> {photos.length} attached</p>
                <p><strong>Notes:</strong> {notes ? 'Added' : 'None'}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmComplete}>
              Confirm Complete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Part Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Parts</DialogTitle>
            <DialogDescription>
              Request additional parts needed for this work order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Part</Label>
              <Select onValueChange={handleRequestPart}>
                <SelectTrigger>
                  <SelectValue placeholder="Select part to request..." />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_PARTS.map(part => (
                    <SelectItem key={part.id} value={part.id}>
                      {part.name} (Available: {part.onHand - part.reserved})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {partRequests.length > 0 && (
              <div className="space-y-2">
                <Label>Requested Parts</Label>
                {partRequests.map(part => (
                  <div key={part.partId} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{part.partName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Label className="text-xs">Quantity:</Label>
                          <Input
                            type="number"
                            min="1"
                            value={part.quantity}
                            onChange={(e) => {
                              const qty = parseInt(e.target.value) || 1;
                              setPartRequests(partRequests.map(p =>
                                p.partId === part.partId ? { ...p, quantity: qty } : p
                              ));
                            }}
                            className="w-20 h-8"
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePartRequest(part.partId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <Label className="text-xs">Reason *</Label>
                      <Textarea
                        placeholder="Why is this part needed?"
                        value={part.reason}
                        onChange={(e) => {
                          setPartRequests(partRequests.map(p =>
                            p.partId === part.partId ? { ...p, reason: e.target.value } : p
                          ));
                        }}
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitPartRequest}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
