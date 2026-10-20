<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The public home keeps planning choices available; protected server functions require Supabase authentication before generating, saving, or reading menus, so private data is never available anonymously.
- AccountProvider owns the single auth subscription; start.ts attaches session bearer tokens to server functions, so session transitions and private queries stay consistent.
- Generate menus on the server and assign user_id from verified context, never caller input; store full recipe and shopping-list snapshots with restrictions and categories in preferences to reopen past plans.
