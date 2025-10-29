import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { MOCK_PART_REQUESTS } from '@/lib/mockPartRequests';
import { PartRequest } from '@/types/partRequest';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function PartRequests() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<PartRequest | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const filteredRequests = MOCK_PART_REQUESTS.filter(request =>
    request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.workOrderTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = () => {
    toast.success(`Part request ${selectedRequest?.id} approved`);
    setShowApproveDialog(false);
    setApprovalNotes('');
    setSelectedRequest(null);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    toast.success(`Part request ${selectedRequest?.id} rejected`);
    setShowRejectDialog(false);
    setRejectionReason('');
    setSelectedRequest(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'approved': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'rejected': return 'bg-red-500/10 text-red-700 dark:text-red-400';
      case 'issued': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Part Requests</h1>
        <p className="text-muted-foreground">Review and approve part requests from technicians</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by request ID, work order, or technician..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{request.id}</CardTitle>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Work Order: {request.workOrderTitle}
                  </p>
                </div>
                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowRejectDialog(true);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowApproveDialog(true);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Requested By</p>
                    <p className="font-medium">{request.requestedBy}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Requested At</p>
                    <p className="font-medium">
                      {new Date(request.requestedAt).toLocaleString()}
                    </p>
                  </div>
                  {request.approvedBy && (
                    <>
                      <div>
                        <p className="text-muted-foreground">Approved By</p>
                        <p className="font-medium">{request.approvedBy}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Approved At</p>
                        <p className="font-medium">
                          {request.approvedAt && new Date(request.approvedAt).toLocaleString()}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Parts Requested:</p>
                  <div className="space-y-2">
                    {request.parts.map((part, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{part.partName}</p>
                            <p className="text-sm text-muted-foreground">
                              SKU: {part.partId}
                            </p>
                            <p className="text-sm mt-1">Quantity: {part.quantity}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Reason: {part.reason}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {request.notes && (
                  <div>
                    <p className="text-sm font-medium mb-1">Notes:</p>
                    <p className="text-sm text-muted-foreground">{request.notes}</p>
                  </div>
                )}

                {request.rejectedReason && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <p className="text-sm font-medium text-destructive mb-1">
                      Rejection Reason:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {request.rejectedReason}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRequests.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No part requests found
            </CardContent>
          </Card>
        )}
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Part Request</DialogTitle>
            <DialogDescription>
              Approve request {selectedRequest?.id} for {selectedRequest?.requestedBy}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Parts to approve:</p>
              <ul className="text-sm space-y-1">
                {selectedRequest?.parts.map((part, index) => (
                  <li key={index}>
                    • {part.partName} × {part.quantity}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <label className="text-sm font-medium">Approval Notes (Optional)</label>
              <Textarea
                placeholder="Add any notes about this approval..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove}>Approve Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Part Request</DialogTitle>
            <DialogDescription>
              Reject request {selectedRequest?.id} for {selectedRequest?.requestedBy}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Rejection Reason *</label>
              <Textarea
                placeholder="Explain why this request is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-2"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
