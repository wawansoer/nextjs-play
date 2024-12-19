import { Allow, Entity, Fields, Validators } from 'remult'

@Entity('Tasks', {
  allowApiRead: true,
  allowApiDelete: Allow.authenticated,
  allowApiUpdate: Allow.authenticated,
  allowApiInsert: Allow.authenticated,
})
export class Task {
  @Fields.uuid()
  id = ''

  @Fields.string({
    validate: [
      Validators.required('Title is required'),
      Validators.minLength(3, 'Title must be at least 3 characters'),
    ]
  })
  title = ''

  @Fields.boolean({
    validate: Validators.required('Completed is required')
  })
  completed?: boolean

  @Fields.createdAt()
  createdAt?: Date
}
