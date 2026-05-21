// ── useForm ──
// Generic form state management composable
import { reactive, ref } from 'vue'

export function useForm(initialValues = {}, validationRules = {}) {
  const form    = reactive({ ...initialValues })
  const errors  = reactive({})
  const loading = ref(false)
  const submitted = ref(false)

  function validate() {
    let valid = true
    Object.keys(validationRules).forEach((field) => {
      const rules = validationRules[field]
      errors[field] = ''

      if (rules.required && !form[field]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        valid = false
        return
      }

      if (rules.email && form[field] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form[field])) {
        errors[field] = 'Please enter a valid email'
        valid = false
        return
      }

      if (rules.minLength && form[field]?.length < rules.minLength) {
        errors[field] = `Minimum ${rules.minLength} characters required`
        valid = false
      }
    })
    return valid
  }

  function reset() {
    Object.keys(initialValues).forEach((key) => {
      form[key] = initialValues[key]
    })
    Object.keys(errors).forEach((key) => {
      errors[key] = ''
    })
    submitted.value = false
  }

  async function handleSubmit(submitFn) {
    if (!validate()) return false
    loading.value = true
    try {
      await submitFn(form)
      submitted.value = true
      return true
    } catch (err) {
      return false
    } finally {
      loading.value = false
    }
  }

  return { form, errors, loading, submitted, validate, reset, handleSubmit }
}
