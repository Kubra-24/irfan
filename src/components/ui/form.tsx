import React, {
  createContext,
  useContext,
  useRef,
  ReactNode,
  ReactElement,
  ForwardedRef,
  forwardRef,
  cloneElement,
  Children,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import {
  Controller,
  Control,
  FieldValues,
  RegisterOptions,
  useFormContext,
  FormProvider,
  ControllerRenderProps,
  ControllerFieldState,
  UseFormStateReturn,
  Path,
} from "react-hook-form";

interface FormFieldContextValue {
  name: Path<FieldValues>;
}
const FormFieldContext = createContext<FormFieldContextValue | undefined>(undefined);

interface FormItemContextValue {
  id: string;
}
const FormItemContext = createContext<FormItemContextValue | undefined>(undefined);

const Form = FormProvider;

interface FormFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  defaultValue?: any;
  children: (
    props: {
      field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
      fieldState: ControllerFieldState;
      formState: UseFormStateReturn<TFieldValues>;
    }
  ) => ReactElement;
}

function FormField<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  defaultValue,
  children,
}: FormFieldProps<TFieldValues>) {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field, fieldState, formState }) =>
          children({ field, fieldState, formState })
        }
      />
    </FormFieldContext.Provider>
  );
}

function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error("useFormField must be used inside FormField");
  }
  if (!itemContext) {
    throw new Error("useFormField must be used inside FormItem");
  }

  const fieldState = getFieldState(fieldContext.name, formState);
  const id = itemContext.id;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

interface FormItemProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

function FormItem({ children, style }: FormItemProps) {
  const idRef = useRef(Math.random().toString(36).slice(2));
  return (
    <FormItemContext.Provider value={{ id: idRef.current }}>
      <View style={[styles.formItem, style]}>{children}</View>
    </FormItemContext.Provider>
  );
}

interface FormLabelProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

function FormLabel({ children, style }: FormLabelProps) {
  const { error } = useFormField();
  return (
    <Text style={[styles.label, error && styles.labelError, style]}>
      {children}
    </Text>
  );
}

interface FormControlProps {
  children: ReactElement | ReactElement[];
  style?: StyleProp<ViewStyle>;
}

const FormControl = forwardRef<View, FormControlProps>(
  ({ children, style, ...props }, ref: ForwardedRef<View>) => {
    const { error } = useFormField();

    return (
      <View
        accessibilityState={error ? { busy: true } : undefined} // sadece desteklenen prop
        style={style}
        {...props}
        ref={ref}
      >
        {Children.map(children, (child) => cloneElement(child, { ...props }))}
      </View>
    );
  }
);

interface FormDescriptionProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

function FormDescription({ children, style }: FormDescriptionProps) {
  const { formDescriptionId } = useFormField();
  return (
    <Text nativeID={formDescriptionId} style={[styles.description, style]}>
      {children}
    </Text>
  );
}

interface FormMessageProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

function FormMessage({ children, style }: FormMessageProps) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message) : children;

  if (!body) return null;

  return (
    <Text nativeID={formMessageId} style={[styles.message, style]}>
      {body}
    </Text>
  );
}

const styles = StyleSheet.create({
  formItem: {
    marginVertical: 8,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    color: "#000",
    marginBottom: 4,
  },
  labelError: {
    color: "red",
  },
  description: {
    fontSize: 12,
    color: "#666",
  },
  message: {
    fontSize: 12,
    color: "red",
    marginTop: 2,
  },
});

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  useFormField,
};
