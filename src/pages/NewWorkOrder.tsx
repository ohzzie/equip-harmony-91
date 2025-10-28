import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { MOCK_EQUIPMENT } from '@/lib/mockData';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const workOrderSchema = z.object({
  equipmentId: z.string().min(1, 'Equipment is required'),
  type: z.enum(['corrective', 'preventive', 'inspection', 'calibration'], {
    required_error: 'Work order type is required',
  }),
  priority: z.enum(['critical', 'high', 'medium', 'low'], {
    required_error: 'Priority is required',
  }),
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  safetyTags: z.array(z.string()).optional(),
  attachments: z.array(z.string()).optional(),
});

type WorkOrderFormValues = z.infer<typeof workOrderSchema>;

const SAFETY_TAGS = [
  'LOTO Required',
  'Hot Work',
  'Confined Space',
  'Working at Height',
  'Electrical Work',
  'Lifting Operations',
  'Chemical Handling',
];

export default function NewWorkOrder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSafetyTags, setSelectedSafetyTags] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);

  const form = useForm<WorkOrderFormValues>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      equipmentId: '',
      type: undefined,
      priority: 'medium',
      title: '',
      description: '',
      safetyTags: [],
      attachments: [],
    },
  });

  const selectedEquipment = MOCK_EQUIPMENT.find(
    eq => eq.id === form.watch('equipmentId')
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments([...attachments, ...files]);
    toast({
      description: `${files.length} file(s) attached`,
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const onSubmit = (data: WorkOrderFormValues) => {
    // Add safety tags and attachments to form data
    const formData = { 
      ...data, 
      safetyTags: selectedSafetyTags,
      attachments: attachments.map(f => f.name)
    };
    
    console.log('New Work Order:', formData);
    
    toast({
      title: 'Work Order Created',
      description: `${formData.title} has been created successfully with ${attachments.length} attachment(s).`,
    });

    // Navigate back to work orders list
    navigate('/work-orders');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/work-orders')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Work Order</h1>
          <p className="text-muted-foreground">Report equipment issues or schedule maintenance</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Work Order Details</CardTitle>
                  <CardDescription>Provide information about the maintenance request</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Equipment Selection */}
                  <FormField
                    control={form.control}
                    name="equipmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipment *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select equipment" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MOCK_EQUIPMENT.map(eq => (
                              <SelectItem key={eq.id} value={eq.id}>
                                {eq.name} - {eq.area}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Type and Priority Row */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Order Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="corrective">Corrective</SelectItem>
                              <SelectItem value="preventive">Preventive</SelectItem>
                              <SelectItem value="inspection">Inspection</SelectItem>
                              <SelectItem value="calibration">Calibration</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="critical">Critical</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Brief description of the issue or task"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a clear, concise summary (5-200 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detailed description of the issue, symptoms, or maintenance required"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include relevant details, symptoms, error codes, or observations
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </CardContent>
              </Card>

              {/* Attachments */}
              <Card>
                <CardHeader>
                  <CardTitle>Attachments & Evidence</CardTitle>
                  <CardDescription>
                    Upload photos, documents, or other evidence related to this work order
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="attachments">Upload Files</Label>
                    <Input
                      id="attachments"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="cursor-pointer"
                      accept="image/*,.pdf,.doc,.docx"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Supported: Images, PDF, Word documents
                    </p>
                  </div>

                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      <Label>Attached Files ({attachments.length})</Label>
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                          <div className="flex-1 truncate">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Safety Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Safety Requirements
                  </CardTitle>
                  <CardDescription>
                    Select all applicable safety requirements for this work order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {SAFETY_TAGS.map(tag => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={tag}
                          checked={selectedSafetyTags.includes(tag)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSafetyTags([...selectedSafetyTags, tag]);
                            } else {
                              setSelectedSafetyTags(
                                selectedSafetyTags.filter(t => t !== tag)
                              );
                            }
                          }}
                        />
                        <Label
                          htmlFor={tag}
                          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Equipment Info Card */}
              {selectedEquipment && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Equipment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">Location</p>
                      <p className="font-medium">{selectedEquipment.site}</p>
                      <p className="text-muted-foreground">
                        {selectedEquipment.area}
                        {selectedEquipment.line && ` - ${selectedEquipment.line}`}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Type</p>
                      <p>{selectedEquipment.type}</p>
                    </div>
                    {selectedEquipment.manufacturer && (
                      <div>
                        <p className="font-medium text-muted-foreground">Manufacturer</p>
                        <p>{selectedEquipment.manufacturer}</p>
                        {selectedEquipment.model && (
                          <p className="text-muted-foreground">Model: {selectedEquipment.model}</p>
                        )}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-muted-foreground">Status</p>
                      <p className="capitalize">{selectedEquipment.status}</p>
                    </div>
                    {selectedEquipment.lastPM && (
                      <div>
                        <p className="font-medium text-muted-foreground">Last PM</p>
                        <p>{new Date(selectedEquipment.lastPM).toLocaleDateString()}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Form Actions */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <Button type="submit" className="w-full" size="lg">
                    Create Work Order
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/work-orders')}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
