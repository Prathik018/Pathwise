'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parse } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { entrySchema } from '@/app/lib/schema';
import { Sparkles, PlusCircle, X, Pencil, Loader2 } from 'lucide-react';
import { improveWithAI } from '@/actions/resume';
import { toast } from 'sonner';
import useFetch from '@/hooks/use-fetch';

const formatDisplayDate = (dateString) => {
  if (!dateString) return '';
  const date = parse(dateString, 'yyyy-MM', new Date());
  return format(date, 'MMM yyyy');
};

const parseMonthValue = (displayDate) => {
  if (!displayDate) return '';
  const date = parse(displayDate, 'MMM yyyy', new Date());
  if (isNaN(date.getTime())) return '';
  return format(date, 'yyyy-MM');
};

export function EntryForm({ type, entries, onChange }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const {
    control,
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: '',
      organization: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false,
    },
  });

  const current = watch('current');

  const resetForm = useCallback(() => {
    reset({
      title: '',
      organization: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false,
    });
    setEditingIndex(null);
  }, [reset]);

  const startEditing = (index) => {
    const entry = entries[index];
    setValue('title', entry.title || '');
    setValue('organization', entry.organization || '');
    setValue('startDate', parseMonthValue(entry.startDate));
    setValue('endDate', parseMonthValue(entry.endDate));
    setValue('description', entry.description || '');
    setValue('current', entry.current || false);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? '' : formatDisplayDate(data.endDate),
    };

    if (editingIndex !== null) {
      const updated = [...entries];
      updated[editingIndex] = formattedEntry;
      onChange(updated);
      toast.success('Entry updated');
    } else {
      onChange([...entries, formattedEntry]);
    }

    resetForm();
    setIsAdding(false);
  });

  const handleDelete = (index) => {
    onChange(entries.filter((_, i) => i !== index));
  };

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue('description', improvedContent);
      toast.success('Description improved successfully!');
    }
    if (improveError) {
      toast.error(improveError.message || 'Failed to improve description');
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  const handleImproveDescription = async () => {
    const description = watch('description');
    if (!description) {
      toast.error('Please enter a description first');
      return;
    }

    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {entries.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title} @ {item.organization}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => startEditing(index)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => handleDelete(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {item.current
                  ? `${item.startDate} - Present`
                  : `${item.startDate} - ${item.endDate}`}
              </p>
              <p className="mt-2 text-sm whitespace-pre-wrap">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIndex !== null ? `Edit ${type}` : `Add ${type}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  placeholder="Title/Position"
                  {...register('title')}
                  error={errors.title}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Organization/Company"
                  {...register('organization')}
                  error={errors.organization}
                />
                {errors.organization && (
                  <p className="text-sm text-red-500">
                    {errors.organization.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  type="month"
                  {...register('startDate')}
                  error={errors.startDate}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  type="month"
                  {...register('endDate')}
                  disabled={current}
                  error={errors.endDate}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="current"
                {...register('current')}
                onChange={(e) => {
                  setValue('current', e.target.checked);
                  if (e.target.checked) {
                    setValue('endDate', '');
                  }
                }}
              />
              <label htmlFor="current">Current {type}</label>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder={`Description of your ${type.toLowerCase()}`}
                className="h-32"
                {...register('description')}
                error={errors.description}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleImproveDescription}
              disabled={isImproving || !watch('description')}
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Improve with AI
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {editingIndex !== null ? 'Update Entry' : 'Add Entry'}
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
}
