<?php

function dlts_viewer_update_book_topic () {
 $result = db_query("SELECT nid,tnid FROM node WHERE type = 'dlts_book'");
    foreach ( $result as $record ) {
        $entity = node_load($record->nid);
        $ewrapper = entity_metadata_wrapper('node', $entity);
        $call_number=$ewrapper->field_call_number->value();
        $topic_letter=substr($call_number,0,1);
        $topic=$ewrapper->field_topic->value();
        if($record->tnid==0) {
            switch ($topic_letter) {
                case 'A':
                    if(count($topic)==0) {
                        $topic[]='General Works';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'B':
                    if(count($topic)==0) {
                        $topic[]='Philosophy. Psychology. Religion';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'C':
                    if(count($topic)==0) {
                        $topic[]='Auxiliary Sciences of History';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'D':
                    if(count($topic)==0) {
                        $topic[]='World History and History of Europe, Asia, Africa, Australia, New Zealand, etc.';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'E':
                    if(count($topic)==0) {
                        $topic[]='History of the Americas';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'F':
                    if(count($topic)==0) {
                        $topic[]='History of the Americas';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'G':
                    if(count($topic)==0) {
                        $topic[]='Geography. Anthropology. Recreation';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'H':
                    if(count($topic)==0) {
                        $topic[]='Social Sciences';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'J':
                    if(count($topic)==0) {
                        $topic[]='Political Science';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'K':
                    if(count($topic)==0) {
                        $topic[]='Law';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'L':
                    if(count($topic)==0) {
                        $topic[]='Education';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'M':
                    if(count($topic)==0) {
                        $topic[]='Music and Books on Music';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'N':
                    if(count($topic)==0) {
                        $topic[]='Fine Arts';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'P':
                    if(count($topic)==0) {
                        $topic[]='Language and Literature';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'Q':
                    if(count($topic)==0) {
                        $topic[]='Science';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'R':
                    if(count($topic)==0) {
                        $topic[]='Medicine';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'S':
                    if(count($topic)==0) {
                        $topic[]='Agriculture';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'T':
                    if(count($topic)==0) {
                        $topic[]='Technology';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'U':
                    if(count($topic)==0) {
                        $topic[]='Military Science';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'V':
                    if(count($topic)==0) {
                        $topic[]='Naval Science';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'Z':
                    if(count($topic)==0) {
                        $topic[]='Bibliography. Library Science. Information Resources (General)';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
              break;
            }
        }
        else {
            switch ($topic_letter) {
                case 'A':
                    if(count($topic)==0) {
                        $topic[]='المعارف العامة';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'B':
                    if(count($topic)==0) {
                        $topic[]='الفلسفة وعلم النفس والدين';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'C':
                    if(count($topic)==0) {
                        $topic[]='العلوم الفرعية للتاريخ';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'D':
                    if(count($topic)==0) {
                        $topic[]='تاريخ العالم وتاريخ أوروبا وآسيا وأفريقيا';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'E':
                    if(count($topic)==0) {
                        $topic[]='تاريخ أمريكا';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'F':
                    if(count($topic)==0) {
                        $topic[]='تاريخ أمريكا';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'G':
                    if(count($topic)==0) {
                        $topic[]='الجغرافيا والأنثربولوجيا والترفيه';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'H':
                    if(count($topic)==0) {
                        $topic[]='العلوم الاجتماعية';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'J':
                    if(count($topic)==0) {
                        $topic[]='العلوم السياسية';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'K':
                    if(count($topic)==0) {
                        $topic[]='القانون';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'L':
                    if(count($topic)==0) {
                        $topic[]='التعليم';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'M':
                    if(count($topic)==0) {
                        $topic[]='الموسيقى';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'N':
                    if(count($topic)==0) {
                        $topic[]='الفنون الجميلة';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'P':
                    if(count($topic)==0) {
                        $topic[]='Language and Literature';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'M':
                    if(count($topic)==0) {
                        $topic[]='Music and Books on Music';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'N':
                    if(count($topic)==0) {
                        $topic[]='اللغات والآداب';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'P':
                    if(count($topic)==0) {
                        $topic[]='اللغات والآداب';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'Q':
                    if(count($topic)==0) {
                        $topic[]='العلوم';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'R':
                    if(count($topic)==0) {
                        $topic[]='الطب';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'S':
                    if(count($topic)==0) {
                        $topic[]='الزراعة';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'T':
                    if(count($topic)==0) {
                        $topic[]='التكنولوجيا';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'U':
                    if(count($topic)==0) {
                        $topic[]='العلوم العسكرية';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'V':
                    if(count($topic)==0) {
                        $topic[]='العلوم البحرية';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                case 'Z':
                    if(count($topic)==0)  {
                        $topic[]='الببليوغرافيا ، وعلوم المكتبات ، والمعلومات العامة';
                        $ewrapper->field_topic->set($topic);
                    }
                    break;
                    break;
            }
        }
        $ewrapper->save();
    }
}

