import { FC } from "react"

interface PropsModal {
    open: boolean,
    onClose: () => void,
    watch: boolean
}

export interface ICrudCreateButtonProps {
    Modal: FC<PropsModal>
    Title: string
}