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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MOCK_PART_REQUESTS } from '@/lib/mockPartRequests';
import { PartRequest } from '@/types/partRequest';
import { Search, CheckCircle, XCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function PartRequests() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<PartRequest | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

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

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Part Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No part requests found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Work Order</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Parts Count</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell className="max-w-xs truncate">{request.workOrderTitle}</TableCell>
                    <TableCell>{request.requestedBy}</TableCell>
                    <TableCell>
                      {new Date(request.requestedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{request.parts.length}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowRejectDialog(true);
                              }}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowApproveDialog(true);
                              }}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Part Request Details</DialogTitle>
            <DialogDescription>
              Request {selectedRequest?.id} - {selectedRequest?.workOrderTitle}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Requested By</p>
                <p className="text-sm font-semibold">{selectedRequest?.requestedBy}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Requested At</p>
                <p className="text-sm font-semibold">
                  {selectedRequest && new Date(selectedRequest.requestedAt).toLocaleString()}
                </p>
              </div>
              {selectedRequest?.approvedBy && (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Approved By</p>
                    <p className="text-sm font-semibold">{selectedRequest.approvedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Approved At</p>
                    <p className="text-sm font-semibold">
                      {selectedRequest.approvedAt && new Date(selectedRequest.approvedAt).toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Parts Requested</p>
              <div className="space-y-3">
                {selectedRequest?.parts.map((part, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold">{part.partName}</p>
                      <Badge variant="secondary">Qty: {part.quantity}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">SKU: {part.partId}</p>
                    <p className="text-sm">
                      <span className="font-medium">Reason:</span> {part.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {selectedRequest?.notes && (
              <div>
                <p className="text-sm font-medium mb-2">Notes</p>
                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  {selectedRequest.notes}
                </p>
              </div>
            )}

            {selectedRequest?.rejectedReason && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm font-medium text-destructive mb-1">Rejection Reason</p>
                <p className="text-sm">{selectedRequest.rejectedReason}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Part Request</DialogTitle>
            <DialogDescription>
              Approve part request {selectedRequest?.id} for {selectedRequest?.workOrderTitle}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Approval Notes (Optional)</label>
              <Textarea
                placeholder="Add any notes about this approval..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Part Request</DialogTitle>
            <DialogDescription>
              Reject part request {selectedRequest?.id} for {selectedRequest?.workOrderTitle}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rejection Reason *</label>
              <Textarea
                placeholder="Provide a reason for rejecting this request..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
