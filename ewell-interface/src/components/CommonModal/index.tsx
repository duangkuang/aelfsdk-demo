import { ReactNode, forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import './styles.less';
import { Button, Modal } from 'aelf-design';
import type { ModalProps } from 'antd';
import closeSvg from 'assets/images/close.svg';
import clsx from 'clsx';

export interface ICommonModalProps extends ModalProps {
  children?: ReactNode;
  className?: string;
  title?: string;
  cancelText?: string;
  onCancelClick?: () => void;
  confirmText?: string;
  onConfirmClick?: () => void;
}

export interface ICommonModalInterface {
  show: () => void;
  hide: () => void;
}

export const CommonModal = forwardRef((props: ICommonModalProps, ref) => {
  const { className, width, title, confirmText, onConfirmClick, cancelText, onCancelClick, children } = props;
  const [isOpen, setIsOpen] = useState(false);

  const show = useCallback(() => {
    setIsOpen(true);
  }, []);

  const hide = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onCancel = useCallback(() => {
    setIsOpen(false);
    onCancelClick?.();
  }, [onCancelClick]);

  const onConfirm = useCallback(() => {
    setIsOpen(false);
    onConfirmClick?.();
  }, [onConfirmClick]);

  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  return (
    <Modal width={width} title={null} footer={null} open={isOpen} closeIcon={false}>
      <div className={clsx(['common-modal-frame', className])}>
        <div className="common-modal-header">
          {title || ''}
          <img className="common-modal-close" src={closeSvg} alt="" onClick={onCancel} />
        </div>
        <div className="common-modal-content">{children}</div>
        <div className="common-modal-footer">
          <div className="common-modal-btn">
            <Button onClick={onCancel} block>
              {cancelText || 'Cancel'}
            </Button>
          </div>
          <div className="common-modal-btn">
            <Button type="primary" onClick={onConfirm} block>
              {confirmText || 'Confirm'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
});
