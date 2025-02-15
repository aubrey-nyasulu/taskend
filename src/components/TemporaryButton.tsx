"use client"

export default function TemporaryButton() {
    return (
        <button onClick={() => {
            if (document) {
                document.body.classList.toggle('dark')
            }
        }}>toggle dark</button>
    )
}
