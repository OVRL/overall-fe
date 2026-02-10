import { render, screen } from '@testing-library/react';
import Icon from '../ui/Icon';
import '@testing-library/jest-dom';
import { type StaticImageData } from 'next/image';

// Mock StaticImageData object
const mockIconSrc: StaticImageData = {
  src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==',
  height: 24,
  width: 24,
  blurDataURL: 'data:image/png;base64,',
  blurWidth: 0,
  blurHeight: 0,
};

describe('Icon 컴포넌트', () => {
  it('기본 상태(nofill=false/undefined)에서 마스킹 스타일이 적용되어야 한다.', () => {
    render(<Icon src={mockIconSrc} alt="test-icon" />);

    const img = screen.getByRole('img', { name: "test-icon" });


    expect(img.style.backgroundColor).toBe('currentcolor');
    expect(img.style.mask).toContain(`url("${mockIconSrc.src}")`);
  });

  it('nofill=true일 때 원본 이미지가 렌더링되어야 한다.', () => {
    render(<Icon src={mockIconSrc} nofill={true} alt="original-icon" />);

    const img = screen.getByRole('img', { name: "original-icon" });

    // mask 스타일이 없어야 함
    expect(img.style.mask).toBe('');
  });

  it('width와 height props가 전달되면 적용되어야 한다.', () => {
    render(<Icon src={mockIconSrc} width={50} height={50} />);
    const img = screen.getByRole('img');

    expect(img).toHaveAttribute('width', '50');
    expect(img).toHaveAttribute('height', '50');
  });

  it('추가적인 style이 전달되면 마스킹 스타일과 병합되어야 한다.', () => {
    const customStyle = { opacity: 0.5 };
    render(<Icon src={mockIconSrc} style={customStyle} />);

    const img = screen.getByRole('img');
    expect(img).toHaveStyle({ opacity: '0.5' });
    expect(img.style.backgroundColor).toBe('currentcolor');
    expect(img.style.mask).toContain(`url("${mockIconSrc.src}")`);
  });

  it('alt prop이 없을 경우 기본값 "icon"이 사용되어야 한다.', () => {
    render(<Icon src={mockIconSrc} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'icon');
  });
});
