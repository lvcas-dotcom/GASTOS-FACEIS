export default function MeusGruposLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg
        className="h-8 w-8 animate-spin text-purple-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <span className="sr-only">Carregando grupos…</span>
    </div>
  )
}
