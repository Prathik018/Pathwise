'use client';

import { useState, useCallback } from 'react';
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
import { customSectionSchema } from '@/app/lib/schema';
import { PlusCircle, X, Pencil } from 'lucide-react';

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

export function CustomSectionForm({ entries, onChange }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const {
    control,
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(customSectionSchema),
    defaultValues: {
      heading: '',
      title: '',
      date: '',
      link: '',
      description: '',
    },
  });

  const resetForm = useCallback(() => {
    reset({
      heading: '',
      title: '',
      date: '',
      link: '',
      description: '',
    });
    setEditingIndex(null);
  }, [reset]);

  const startEditing = (index) => {
    const entry = entries[index];
    setValue('heading', entry.heading || '');
    setValue('title', entry.title || '');
    setValue('date', parseMonthValue(entry.date));
    setValue('link', entry.link || '');
    setValue('description', entry.description || '');
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleAdd = handleValidation((data) => {
    const formatted = {
      ...data,
      date: data.date ? formatDisplayDate(data.date) : '',
    };

    if (editingIndex !== null) {
      const updated = [...entries];
      updated[editingIndex] = formatted;
      onChange(updated);
    } else {
      onChange([...entries, formatted]);
    }

    resetForm();
    setIsAdding(false);
  });

  const handleDelete = (index) => {
    onChange(entries.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {entries.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.heading}: {item.title}
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
              {item.date && (
                <p className="text-sm text-muted-foreground">{item.date}</p>
              )}
              {item.link && (
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-medium">link: </span>
                  {item.link}
                </p>
              )}
              {item.description && (
                <p className="mt-2 text-sm whitespace-pre-wrap">
                  {item.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIndex !== null
                ? 'Edit Custom Section'
                : 'Add Custom Section'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Section Heading</label>
              <Input
                placeholder="e.g. Achievements, Certifications, Awards"
                {...register('heading')}
                error={errors.heading}
              />
              {errors.heading && (
                <p className="text-sm text-red-500">{errors.heading.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Title"
                  {...register('title')}
                  error={errors.title}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input type="month" {...register('date')} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Link</label>
              <Input
                placeholder="https://example.com"
                type="url"
                {...register('link')}
                error={errors.link}
              />
              {errors.link && (
                <p className="text-sm text-red-500">{errors.link.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Description"
                className="h-24"
                {...register('description')}
                error={errors.description}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
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
              {editingIndex !== null ? 'Update Section' : 'Add Section'}
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
          Add Custom Section
        </Button>
      )}
    </div>
  );
}
