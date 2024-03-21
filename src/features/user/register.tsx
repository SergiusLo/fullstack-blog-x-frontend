import { Button, Link } from "@nextui-org/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRegisterMutation } from "../../app/services/userApi"
import { ErrorMessage } from "../../components/error-message"
import { Input } from "../../components/input"
import { hasErrorField } from "../../utils/has-error-field"

type Register = {
  email: string
  name: string
  password: string
}

type Props = {
  setSelected: (value: string) => void
}

export const Register: React.FC<Props> = ({ setSelected }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Register>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  })

  const [register, { isLoading }] = useRegisterMutation()
  const [error, setError] = useState("")

  const onSubmit = async (data: Register) => {
    try {
      await register(data).unwrap()
      setSelected("login")
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error)
      }
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        control={control}
        name="name"
        label="Name"
        type="text"
        required="Field is required"
      />
      <Input
        control={control}
        name="email"
        label="Email"
        type="email"
        required="Field is required"
      />
      <Input
        control={control}
        name="password"
        label="Password"
        type="password"
        required="Field is required"
      />
      <ErrorMessage error={error} />
      <p className="text-center text-small">
        You already have an account?{" "}
        <Link
          size="sm"
          className="cursor-pointer"
          onPress={() => setSelected("login")}
        >
          Sign in
        </Link>
      </p>
      <div className="flex gap-2 justify-end">
        <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
          Sign up
        </Button>
      </div>
    </form>
  )
}
