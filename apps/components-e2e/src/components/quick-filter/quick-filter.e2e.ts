/**
 * @license
 * Copyright 2020 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { waitForAngular } from '../../utils/wait-for-angular';
import {
  clearAll,
  getFilterfieldTags,
  tagDeleteButton,
} from '../filter-field/filter-field.po';
import {
  getGroupItem,
  getGroupItemInput,
  getSelectedItem,
} from './quick-filter.po';
import { resetWindowSizeToDefault } from '../../utils';

fixture('Quick Filter')
  .page('http://localhost:4200/quick-filter')
  .meta({
    'filter-field': true,
    'quick-filter': true,
    drawer: true,
    checkbox: true,
    radio: true,
  })
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('if nothing is selected the distinct should be set to all', async (testController: TestController) => {
  await testController
    .expect(getSelectedItem('AUT').textContent)
    .match(/Any/)
    .expect(getSelectedItem('USA').exists)
    .notOk();
});

test('if nothing is selected the filter field should be empty', async (testController: TestController) => {
  await testController.expect(getFilterfieldTags()).eql([]);
});

test('if distinct option gets updated it should update the filter field', async (testController: TestController) => {
  await testController
    .expect(getFilterfieldTags())
    .eql([])
    .click(getGroupItem('AUT', 'Linz'), { speed: 0.3 })
    .expect(getFilterfieldTags())
    .eql(['AUTLinz'])
    .expect(getSelectedItem('AUT').textContent)
    .match(/Linz/)
    .click(getGroupItem('AUT', 'Graz'), { speed: 0.3 })
    .expect(getFilterfieldTags())
    .eql(['AUTGraz'])
    .expect(getSelectedItem('AUT').textContent)
    .match(/Graz/);
});

test('if it is possible to select multiple options', async (testController: TestController) => {
  await testController
    .click(getGroupItem('USA', 'San Francisco'), { speed: 0.4 })
    .expect(getFilterfieldTags())
    .eql(['USASan Francisco'])
    .click(getGroupItem('USA', 'Los Angeles'), { speed: 0.4 })
    .expect(getFilterfieldTags())
    .eql(['USASan Francisco', 'USALos Angeles'])
    .click(getGroupItem('USA', 'New York'), { speed: 0.4 })
    .expect(getFilterfieldTags())
    .eql(['USASan Francisco', 'USALos Angeles', 'USANew York']);
});

test('if it is possible to select and deselect multiple options', async (testController: TestController) => {
  await testController
    .click(getGroupItem('USA', 'San Francisco'))
    .click(getGroupItem('USA', 'Los Angeles'))
    .click(getGroupItem('USA', 'New York'), { speed: 0.4 })
    .expect(getFilterfieldTags())
    .eql(['USASan Francisco', 'USALos Angeles', 'USANew York'])
    .click(getGroupItem('USA', 'San Francisco'), { speed: 0.4 })
    .expect(getFilterfieldTags())
    .eql(['USALos Angeles', 'USANew York']);
});

test('if it is possible to reset all filters via the filter fields clearAll button', async (testController: TestController) => {
  await testController
    .click(getGroupItem('USA', 'San Francisco'))
    .click(getGroupItem('USA', 'Los Angeles'))
    .click(getGroupItem('USA', 'New York'), { speed: 0.4 })
    .expect(getFilterfieldTags())
    .eql(['USASan Francisco', 'USALos Angeles', 'USANew York'])
    .click(clearAll, { speed: 0.4 })
    .expect(getFilterfieldTags())
    .eql([])
    .expect(getSelectedItem('USA').exists)
    .notOk();
});

test('if it is possible to delete an option via the filter field', async (testController: TestController) => {
  await testController
    .click(getGroupItem('USA', 'San Francisco'))
    .click(getGroupItem('USA', 'Los Angeles'))
    .click(getGroupItem('USA', 'New York'), { speed: 0.4 })
    .click(tagDeleteButton('Los Angeles'), { speed: 0.4 })
    .expect(getFilterfieldTags())
    .eql(['USASan Francisco', 'USANew York'])
    .expect(getGroupItemInput('USA', 'New York').checked)
    .ok()
    .expect(getGroupItemInput('USA', 'Los Angeles').checked)
    .notOk();
});

fixture('Quick Filter with initial data')
  .page('http://localhost:4200/quick-filter/initial-data')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('if the initial filter in the filter field be reflected in the quick-filter state', async (testController: TestController) => {
  await testController
    .expect(getSelectedItem('AUT').textContent)
    .match(/Vienna/)
    .expect(getSelectedItem('USA').textContent)
    .match(/New York/);
});

test('if the initial filters are reflected in the filter field ', async (testController: TestController) => {
  await testController
    .expect(getFilterfieldTags())
    .eql(['AUTVienna', 'USANew York']);
});

test('when the distinct group get set to the any option, then remove the group from the filter', async (testController: TestController) => {
  await testController
    .expect(getFilterfieldTags())
    .eql(['AUTVienna', 'USANew York'])
    .click(getGroupItem('AUT', 'Any'), { speed: 0.3 })
    .expect(getFilterfieldTags())
    .eql(['USANew York'])
    .click(getGroupItem('AUT', 'Graz'), { speed: 0.3 })
    .expect(getFilterfieldTags())
    .eql(['USANew York', 'AUTGraz'])
    .expect(getSelectedItem('AUT').textContent)
    .match(/Graz/);
});
