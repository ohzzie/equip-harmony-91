import { useState, useEffect } from 'react';
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
  ArrowLeft,
  Play,
  Pause,
  Clock,
  Camera,
  Package,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PartUsed {
  partId: string;
  partName: string;
  quantity: number;
  unitCost: number;
}

export default function WorkOrderExecution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const workOrder = MOCK_WORK_ORDERS.find(wo => wo.id === id);

  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [partsUsed, setPartsUsed] = useState<PartUsed[]>([]);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  if (!workOrder) {
    return (
      <div className="container py-8">
        <p className="text-muted-foreground">Work order not found</p>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (!timerRunning && workOrder.status === 'assigned') {
      // Auto-update status to in_progress when starting timer
      toast({
        title: 'Work Started',
        description: 'Timer started and work order status updated to In Progress',
      });
    }
    setTimerRunning(!timerRunning);
  };

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
    if (timerRunning) {
      toast({
        title: 'Stop Timer First',
        description: 'Please stop the timer before completing the work order',
        variant: 'destructive',
      });
      return;
    }

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
        <StatusBadge status={workOrder.status} />
        <StatusBadge status={workOrder.priority} />
      </div>

      {/* Timer Card */}
      <Card className={cn(
        "border-2",
        timerRunning && "border-accent bg-accent/5"
      )}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full",
                timerRunning ? "bg-accent animate-pulse" : "bg-muted"
              )}>
                <Clock className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Elapsed</p>
                <p className="text-3xl font-mono font-bold">{formatTime(elapsedTime)}</p>
                <p className="text-xs text-muted-foreground">
                  Labor Hours: {(elapsedTime / 3600).toFixed(2)}
                </p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={handleStartStop}
              className="gap-2"
              variant={timerRunning ? "outline" : "default"}
            >
              {timerRunning ? (
                <>
                  <Pause className="h-5 w-5" />
                  Pause Timer
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  Start Timer
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

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
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Parts & Consumables Used
          </CardTitle>
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
                <p><strong>Labor Hours:</strong> {(elapsedTime / 3600).toFixed(2)} hours</p>
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
    </div>
  );
}
