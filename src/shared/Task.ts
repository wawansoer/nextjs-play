import { Entity, Fields, Validators } from 'remult'

@Entity('tasks', {
  allowApiCrud: true,
})
export class Task {
  @Fields.uuid()
  id = ''

  @Fields.string({
    validate: Validators.required('Title is required')
  })
  title = ''

  @Fields.boolean({
    validate: Validators.required('Completed is required')
  })
  completed?: boolean

  @Fields.createdAt()
  createdAt?: Date
}