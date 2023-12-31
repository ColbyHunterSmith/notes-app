import { z } from 'zod'
import { getUserWorkspaces } from '@/lib/services/workspaces/get-for-user'
import { getAllWorkspaces } from '@/lib/services/workspaces/get-all'
import { createWorkspace } from '@/lib/services/workspaces/create'
import { createWorkspaceSchema } from '@/lib/schemas/create-workspace'
import { deleteWorkspace } from '@/lib/services/workspaces/delete'
import { updateWorkspace } from '@/lib/services/workspaces/update'
import { updateWorkspaceSchema } from '@/lib/schemas/update-workspace'
import { getStarredWorkspaceforUser } from '@/lib/services/starred-workspace/get-for-user'
import { isAuthenticated } from '../middleware/is-authenticated'
import { procedure, router } from '../trpc'
import { updateCollaborators } from '@/lib/services/workspaces/update-collaborators'
import { getWorkspaceById } from '@/lib/services/workspaces/get-by-id'

const workspacesRouter = router({
  getById: procedure
    .use(isAuthenticated)
    .input(z.string())
    .query(async (opts) => {
      const workspace = await getWorkspaceById(opts.input)
      return workspace
    }),

  /**
   * Given note information, add it to the database.
   * @returns Creates the new workspace in database
   */
  createWorkspace: procedure
    .use(isAuthenticated)
    .input(createWorkspaceSchema)
    .mutation(async (opts) => {
      const workspace = await createWorkspace({ ...opts.input, userId: opts.ctx.session.user.id })
      return workspace
    }),

  deleteWorkspace: procedure
    .use(isAuthenticated)
    .input(z.string())
    .mutation(async (opts) => {
      const deletedWorkspace = await deleteWorkspace(opts.input)
      return deletedWorkspace
    }),

  updateWorkspace: procedure
    .use(isAuthenticated)
    .input(updateWorkspaceSchema)
    .mutation(async (opts) => {
      const updatedNote = await updateWorkspace(opts.input)
      return updatedNote
    }),
  /**
   * Get all workspaces in the database.
   */
  getAllWorkspaces: procedure.query(async () => {
    const allWorkspaces = await getAllWorkspaces()
    return allWorkspaces
  }),

  /**
   * Get the currently authenticated user's workspaces.
   */
  getWorkspacesForCurrentUser: procedure.use(isAuthenticated).query(async (opts) => {
    const workspaces = getUserWorkspaces(opts.ctx.session.user.id)
    return workspaces
  }),

  getStarredWorkspacesForUser: procedure.use(isAuthenticated).query(async (opts) => {
    const starredWorkspaces = getStarredWorkspaceforUser(opts.ctx.session.user.id)
    return starredWorkspaces
  }),

  updateCollaborators: procedure
    .use(isAuthenticated)
    .input(
      z.object({
        workspaceId: z.string(),
        userIds: z.string().array(),
      }),
    )
    .mutation(async (opts) => {
      const result = await updateCollaborators(opts.input)
      return result
    }),
})

export default workspacesRouter
