# REFOUND – UI preview (no backend)

    npm install
    npm run dev      # open http://localhost:5173

All pages work with sample data (no server/database needed).
Open any URL directly:

User:  /dashboard /browse /report/lost /report/found /edit/i1 /items/i1 /items/i3 /my-items /matches /claims /chat /chat/m1 /notifications /profile
Admin: /admin /admin/users /admin/items /admin/claims /admin/categories
Public: / /login /register /admin/login   (any email/password logs in; /admin/login gives the admin view)

Page components and styles are unchanged. Only added: src/mock/ (sample data), a mock adapter line in src/api.js,
a preview user in src/store/authSlice.js, and a stub src/socket.js.
