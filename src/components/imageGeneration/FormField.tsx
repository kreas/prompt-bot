type FormFieldProps = {
  label: string
  children: React.ReactNode
  value: string | number | boolean | undefined
  hint?: string
  badge?: boolean
}

const FormField: React.FC<FormFieldProps> = ({ label, children, value, hint, badge = true }) => {
  return (
    <label className="mt-4">
      <div className="flex">
        <div className="flex-1">{label}</div>
        {badge && <div className="badge badge-lg">{value}</div>}
      </div>
      {hint && <div className="text-sm opacity-60 mb-2">{hint}</div>}
      {children}
    </label>
  )
}

export default FormField
