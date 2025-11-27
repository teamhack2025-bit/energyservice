'use client'

import { useState, FormEvent } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'

export type FieldType = 'text' | 'email' | 'number' | 'date' | 'datetime-local' | 'select' | 'textarea' | 'checkbox'

export interface FieldDef {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: { value: string | number; label: string }[] // For select fields
  min?: number // For number fields
  max?: number // For number fields
  minLength?: number // For text fields
  maxLength?: number // For text fields
  pattern?: string // For text validation
  disabled?: boolean
  helperText?: string
  rows?: number // For textarea
}

export interface EntityFormProps<T> {
  fields: FieldDef[]
  initialData?: Partial<T>
  onSubmit: (data: T) => Promise<void>
  onCancel: () => void
  submitLabel?: string
  cancelLabel?: string
  title?: string
}

interface ValidationError {
  field: string
  message: string
}

export default function EntityForm<T extends Record<string, any>>({
  fields,
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  title
}: EntityFormProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>(initialData)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validateField = (field: FieldDef, value: any): string | null => {
    // Required validation
    if (field.required && (value === undefined || value === null || value === '')) {
      return `${field.label} is required`
    }

    // Skip further validation if field is empty and not required
    if (!value && !field.required) {
      return null
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return `${field.label} must be a valid email address`
      }
    }

    // Number validation
    if (field.type === 'number' && value !== undefined && value !== '') {
      const numValue = Number(value)
      if (isNaN(numValue)) {
        return `${field.label} must be a number`
      }
      if (field.min !== undefined && numValue < field.min) {
        return `${field.label} must be at least ${field.min}`
      }
      if (field.max !== undefined && numValue > field.max) {
        return `${field.label} must be at most ${field.max}`
      }
    }

    // String length validation
    if ((field.type === 'text' || field.type === 'textarea') && value) {
      if (field.minLength !== undefined && value.length < field.minLength) {
        return `${field.label} must be at least ${field.minLength} characters`
      }
      if (field.maxLength !== undefined && value.length > field.maxLength) {
        return `${field.label} must be at most ${field.maxLength} characters`
      }
    }

    // Pattern validation
    if (field.pattern && value) {
      const regex = new RegExp(field.pattern)
      if (!regex.test(value)) {
        return `${field.label} format is invalid`
      }
    }

    return null
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = []

    fields.forEach(field => {
      const value = formData[field.name as keyof T]
      const error = validateField(field, value)
      if (error) {
        newErrors.push({ field: field.name, message: error })
      }
    })

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleChange = (field: FieldDef, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field.name]: value
    }))

    // Clear error for this field when user starts typing
    setErrors(prev => prev.filter(e => e.field !== field.name))
    setSubmitError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setSubmitError(null)

    try {
      await onSubmit(formData as T)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while saving'
      setSubmitError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find(e => e.field === fieldName)?.message
  }

  const renderField = (field: FieldDef) => {
    const value = formData[field.name as keyof T]
    const error = getFieldError(field.name)
    const hasError = !!error

    const baseInputClasses = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
      hasError ? 'border-red-500' : 'border-gray-300'
    }`

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.name}
            name={field.name}
            value={value || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled || loading}
            rows={field.rows || 4}
            className={baseInputClasses}
          />
        )

      case 'select':
        return (
          <select
            id={field.name}
            name={field.name}
            value={value || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            disabled={field.disabled || loading}
            className={baseInputClasses}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.name}
              name={field.name}
              checked={!!value}
              onChange={(e) => handleChange(field, e.target.checked)}
              disabled={field.disabled || loading}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={field.name} className="ml-2 text-sm text-gray-700">
              {field.helperText || field.label}
            </label>
          </div>
        )

      default:
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={value || ''}
            onChange={(e) => {
              const newValue = field.type === 'number' ? e.target.valueAsNumber : e.target.value
              handleChange(field, newValue)
            }}
            placeholder={field.placeholder}
            disabled={field.disabled || loading}
            min={field.min}
            max={field.max}
            minLength={field.minLength}
            maxLength={field.maxLength}
            pattern={field.pattern}
            className={baseInputClasses}
          />
        )
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6">
        {/* Global error message */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{submitError}</p>
            </div>
          </div>
        )}

        {/* Form fields */}
        <div className="space-y-6">
          {fields.map(field => {
            const error = getFieldError(field.name)
            
            return (
              <div key={field.name}>
                {field.type !== 'checkbox' && (
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )}
                
                {renderField(field)}
                
                {/* Helper text */}
                {field.helperText && field.type !== 'checkbox' && !error && (
                  <p className="mt-1 text-sm text-gray-500">{field.helperText}</p>
                )}
                
                {/* Error message */}
                {error && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {error}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Form actions */}
        <div className="mt-8 flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}
