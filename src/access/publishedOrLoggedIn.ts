import type { Access } from 'payload'

// Public visitors only see published docs; logged-in admins see drafts too
export const publishedOrLoggedIn: Access = ({ req }) => {
  if (req.user) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
