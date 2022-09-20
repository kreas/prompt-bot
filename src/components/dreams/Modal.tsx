export interface DreamModalProps {
  children: React.ReactNode
}

const DreamModal: React.FC<DreamModalProps> = ({ children }) => {
  return (
    <>
      <div id="preview" className="modal mt-16" style={{ zIndex: 20_000 }}>
        <div className="w-full h-full bg-base-100">
          <a className="btn btn-sm btn-circle absolute right-2 top-2" style={{ zIndex: 50 }} href="#">
            ✕
          </a>
          <div className="flex w-full h-full bg-base-100">
            <div className="w-full overflow-auto p-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DreamModal
