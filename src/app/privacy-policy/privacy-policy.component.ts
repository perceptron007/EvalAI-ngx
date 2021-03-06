import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document) { }

  /**
   * Checks if element is visible (called after scroll event)
   * @param {el} Checks the visibility of this element
   * @returns {IS_VISIBLE} returns a boolean
   */
  isScrolledIntoView(el) {
    const RECT = el.getBoundingClientRect();
    const ELEM_TOP = RECT.top;
    const ELEM_BOTTOM = RECT.bottom;
    const HEADER_HEIGHT = this.document.getElementById('header-static').clientHeight;
    // Only completely visible elements return true:
    const IS_VISIBLE = (ELEM_TOP >= HEADER_HEIGHT) && (ELEM_BOTTOM <= window.innerHeight);
    // Partially visible elements return true:
    // isVisible = ELEM_TOP < window.innerHeight && ELEM_BOTTOM >= 0;
    return IS_VISIBLE;
  }

  /**
   * Highlights the nav for the corresponding element
   * @param {el} Highlights nav corresponding to this element
   */
  highlightNav(el) {
    const ALL_NAVS = this.document.getElementsByClassName('privacy-nav');
    [].forEach.call(ALL_NAVS, function (item) {
      item.classList.remove('scroll-selected');
      if (item.id === el) {
        item.className += ' scroll-selected';
      }
    });
  }

  ngOnInit() {
    this.document['manuallyScrolling'] = false;
    const ID_TEXT = 'privacy-';
    let i = 1;
    const allNavs = this.document.getElementsByClassName('privacy-nav');
    [].forEach.call(allNavs, function (item) {
      item.id = ID_TEXT + i.toString() + '-nav';
      i = i + 1;
    });
    i = 1;
    const ALL_TARGETS = this.document.getElementsByClassName('privacy-section-title');
    [].forEach.call(ALL_TARGETS, function (item) {
      item.id = ID_TEXT + i.toString();
      i = i + 1;
    });
  }

  /**
   * Listener for page scroll event
   */
  @HostListener('window:scroll', [])
    onWindowScroll(): void {
    if (!this.document['manuallyScrolling']) {
        const ALL_TARGETS = this.document.getElementsByClassName('privacy-section-title');
        const SELF = this;
        [].some.call(ALL_TARGETS, function (item) {
          const elem = SELF.document.getElementById(item.id);
          if (SELF.isScrolledIntoView(elem)) {
            SELF.highlightNav(item.id + '-nav');
            const ELEM_NAV = SELF.document.getElementById(item.id + '-nav');
            if (!SELF.isScrolledIntoView(ELEM_NAV)) {
              ELEM_NAV.scrollIntoView();
            }
            return true;
          }
        });
    }
    }

  /**
   * Scrolls the item into view based on the nav item that is clicked
   * @param {event} Gets the click event from the nav element
   */
  scroll(event) {
    this.document['manuallyScrolling'] = true;
    setTimeout(() => {
      this.document['manuallyScrolling'] = false;
    }, 2000);
    // getting id of the clicked item
    const TARGET = event.target || event.srcElement || event.currentTarget;
    const ID = TARGET.attributes.id.value;
    this.highlightNav(ID);

    // Removing -nav from the id of the clicked element
    const ELEMENT_ID = ID.slice(0, -4);
    this.document.getElementById(ELEMENT_ID).scrollIntoView();
    const SCROLLED_Y = window.scrollY;
    if (SCROLLED_Y) {
      const HEADER_HEIGHT = this.document.getElementById('header-static').clientHeight;
      window.scroll(0, SCROLLED_Y - HEADER_HEIGHT);
    }
  }

  /**
   * Scrolls to the top of the page
   */
  scrollToTop() {
    this.document.body.scrollTop = this.document.documentElement.scrollTop = 0;
  }
}
