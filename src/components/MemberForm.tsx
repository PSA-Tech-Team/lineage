import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { addMember } from '../firebase/member';

const memberSchema = yup.object().shape({
  name: yup.string().required(),
  classOf: yup.string().length(4).matches(RegExp('^[0-9]*$')).required(),
  hasAdings: yup.boolean().required(),
  hasAks: yup.boolean().required(),
});

const MemberForm = () => {
  const toast = useToast();

  return (
    <Formik
      initialValues={{
        name: '',
        classOf: '',
        hasAdings: false,
        hasAks: false,
      }}
      validationSchema={memberSchema}
      onSubmit={async (values, actions) => {
        await addMember(values);
        toast({
          title: 'Success!',
          description: `${values.name} has been added.`,
          status: 'success',
        });
        actions.setSubmitting(false);
        actions.resetForm();
      }}
    >
      {({
        handleChange,
        handleReset,
        values,
        touched,
        errors,
        isSubmitting,
      }) => (
        <Form>
          {/* Name */}
          <FormControl
            id="name"
            isRequired
            isInvalid={Boolean(errors.name && touched.name)}
          >
            <FormLabel>Name</FormLabel>
            <Input
              id="name"
              placeholder="Ex: Renzo"
              value={values.name}
              onChange={handleChange}
              onReset={handleReset}
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          {/* Class */}
          <FormControl
            id="classOf"
            isRequired
            isInvalid={Boolean(errors.classOf && touched.classOf)}
          >
            <FormLabel>Class of</FormLabel>
            <Input
              id="classOf"
              placeholder="Ex: 2023"
              value={values.classOf}
              onChange={handleChange}
              onReset={handleReset}
            />
            <FormErrorMessage>{errors.classOf}</FormErrorMessage>
          </FormControl>

          {/* Adings/Aks */}

          <Button
            mt={4}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default MemberForm;
