import { List, Datagrid, TextField, DateField, DateInput, TextInput, Edit, SimpleForm } from 'react-admin';
import { useAuth } from '../../components/AuthContextWrapper';

export const GlossaryList = () => {
    // const { authorId } = useParams();
    const { user } = useAuth()
    return (
        <List resource={`api/glossaries/${user?.id || 39}`} >
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="name" />
                <TextField source="language" />
                <DateField source='created_at' />
                <DateField source='updated_at' />
            </Datagrid>
        </List>
    );
}
export const GlossaryEdit = () => {
    // const { authorId } = useParams();
    const { user } = useAuth()
    return (
        <Edit  >
        <SimpleForm>
                <TextInput source="id" />
                <TextInput source="name" />
                <TextInput source="language" />
                <DateField source='created_at' />
                <DateField source='updated_at' />
                </SimpleForm>
        </Edit>
    );
}